const ytdl = require('../src/index');
const fs = require('fs');

async function testDownload() {
  console.log('🔥 Download Test - ytdl-innertube');
  console.log('='.repeat(60));
  console.log('');

  const videoUrl = 'https://youtu.be/dQw4w9WgXcQ';

  try {
    console.log('📊 Step 1: Getting video info...');
    const info = await ytdl.getInfo(videoUrl);
    console.log(`✅ Title: ${info.videoDetails.title}`);
    console.log(`✅ Formats: ${info.formats.length}`);
    console.log('');

    console.log('📊 Step 2: Selecting format...');
    const format = ytdl.chooseFormat(info.formats, {
      quality: 'lowestaudio',
      filter: 'audioonly'
    });
    console.log(`✅ Selected: itag ${format.itag} (${format.container})`);
    console.log(`   Bitrate: ${format.audioBitrate || format.bitrate}kbps`);
    console.log('');

    console.log('📊 Step 3: Downloading 500KB sample...');
    const outputFile = 'test-download-sample.tmp';
    let downloadedBytes = 0;
    const startTime = Date.now();

    const stream = ytdl(videoUrl, {
      format: format,
      range: { start: 0, end: 512 * 1024 }
    });

    stream.on('info', (info, format) => {
      console.log(`✅ Stream started (itag ${format.itag})`);
    });

    stream.on('data', chunk => {
      downloadedBytes += chunk.length;
      const sizeMB = (downloadedBytes / 1024 / 1024).toFixed(2);
      process.stdout.write(`\r   Downloaded: ${sizeMB} MB`);
    });

    stream.on('end', () => {
      const duration = (Date.now() - startTime) / 1000;
      const speed = (downloadedBytes / 1024 / duration).toFixed(2);

      console.log('');
      console.log('✅ Download complete!');
      console.log(`   Size: ${(downloadedBytes / 1024).toFixed(2)} KB`);
      console.log(`   Time: ${duration.toFixed(2)}s`);
      console.log(`   Speed: ${speed} KB/s`);
      console.log('');

      // Cleanup
      try {
        fs.unlinkSync(outputFile);
        console.log('🗑️  Cleaned up test file');
      } catch (e) {
        // Ignore
      }

      console.log('');
      console.log('🎉 Download test PASSED!');
      process.exit(0);
    });

    stream.on('error', error => {
      console.error('');
      console.error('❌ Download failed:', error.message);
      console.error('Stack:', error.stack);
      process.exit(1);
    });

    stream.pipe(fs.createWriteStream(outputFile));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  testDownload().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = testDownload;
