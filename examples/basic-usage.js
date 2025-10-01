const ytdl = require('../src/index');
const fs = require('fs');

async function basicExample() {
  console.log('🎥 ytdl-innertube - Basic Usage Example');
  console.log('='.repeat(60));
  console.log('');

  const videoUrl = 'https://youtu.be/dQw4w9WgXcQ';

  try {
    // 1. Get video info
    console.log('📊 Fetching video info...');
    const info = await ytdl.getInfo(videoUrl);

    console.log('✅ Video info retrieved!');
    console.log(`   Title: ${info.videoDetails.title}`);
    console.log(`   Author: ${info.videoDetails.author?.name || info.videoDetails.author}`);
    console.log(`   Duration: ${info.videoDetails.lengthSeconds}s`);
    console.log(`   Formats: ${info.formats.length}`);
    console.log('');

    // InnerTube stats
    if (info._innerTube) {
      console.log('🚀 InnerTube Stats:');
      console.log(`   Client: ${info._innerTube.client}`);
      console.log(`   Direct URLs: ${info._innerTube.directUrls}/${info.formats.length}`);
      console.log(`   Needs cipher: ${info._innerTube.needsCipher}`);
      console.log('');
    }

    // 2. Choose audio format
    console.log('🎵 Selecting audio format...');
    const audioFormat = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
      filter: 'audioonly'
    });

    console.log(`✅ Selected: itag ${audioFormat.itag}`);
    console.log(`   Container: ${audioFormat.container}`);
    console.log(`   Bitrate: ${audioFormat.audioBitrate || audioFormat.bitrate}kbps`);
    console.log(`   Size: ${(audioFormat.contentLength / 1024 / 1024).toFixed(2)} MB`);
    console.log('');

    // 3. Download sample (first 500KB)
    console.log('⬇️  Downloading 500KB sample...');
    const outputFile = 'sample-audio.m4a';

    let downloadedBytes = 0;
    const startTime = Date.now();

    const stream = ytdl(videoUrl, {
      format: audioFormat,
      range: { start: 0, end: 512 * 1024 }
    });

    stream.on('data', chunk => {
      downloadedBytes += chunk.length;
      const sizeMB = (downloadedBytes / 1024 / 1024).toFixed(2);
      process.stdout.write(`\r   Progress: ${sizeMB} MB`);
    });

    stream.on('end', () => {
      const duration = (Date.now() - startTime) / 1000;
      const speed = (downloadedBytes / 1024 / duration).toFixed(2);

      console.log('');
      console.log('✅ Download complete!');
      console.log(`   Size: ${(downloadedBytes / 1024).toFixed(2)} KB`);
      console.log(`   Time: ${duration.toFixed(2)}s`);
      console.log(`   Speed: ${speed} KB/s`);
      console.log(`   File: ${outputFile}`);
      console.log('');
      console.log('🎉 Example completed successfully!');

      // Cleanup
      setTimeout(() => {
        try {
          fs.unlinkSync(outputFile);
          console.log('🗑️  Sample file cleaned up');
        } catch (e) {
          // File may not exist
        }
      }, 1000);
    });

    stream.on('error', error => {
      console.error('❌ Download error:', error.message);
    });

    stream.pipe(fs.createWriteStream(outputFile));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

if (require.main === module) {
  basicExample().catch(console.error);
}

module.exports = basicExample;
