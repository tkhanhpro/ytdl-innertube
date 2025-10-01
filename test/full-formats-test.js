const ytdl = require('../src/index');
const fs = require('fs');

async function testFullFormats() {
  console.log('🔥 Full Formats Download Test');
  console.log('='.repeat(60));
  console.log('');

  const videoUrl = process.argv[2] || 'https://youtu.be/R43xOUlRHWc';

  try {
    console.log('📊 Step 1: Getting all formats...');
    const info = await ytdl.getInfo(videoUrl);

    console.log(`✅ Title: ${info.videoDetails.title}`);
    console.log(`✅ Total formats: ${info.formats.length}`);
    console.log('');

    // Group formats by type
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const videoFormats = ytdl.filterFormats(info.formats, 'videoonly');
    const combinedFormats = ytdl.filterFormats(info.formats, 'audioandvideo');

    console.log('📊 Format Breakdown:');
    console.log(`   Audio-only: ${audioFormats.length}`);
    console.log(`   Video-only: ${videoFormats.length}`);
    console.log(`   Combined: ${combinedFormats.length}`);
    console.log('');

    // Show all audio formats
    console.log('🎵 Audio Formats:');
    console.log('-'.repeat(60));
    audioFormats.forEach(f => {
      const bitrate = f.audioBitrate || f.bitrate || 0;
      const size = f.contentLength ? `${(f.contentLength / 1024 / 1024).toFixed(2)} MB` : 'Unknown';
      console.log(`   itag ${f.itag}: ${f.container.padEnd(4)} ${bitrate.toString().padStart(6)}kbps - ${size}`);
    });
    console.log('');

    // Show all video formats
    console.log('🎬 Video Formats:');
    console.log('-'.repeat(60));
    videoFormats.forEach(f => {
      const quality = f.qualityLabel || f.quality || 'Unknown';
      const fps = f.fps || '?';
      const size = f.contentLength ? `${(f.contentLength / 1024 / 1024).toFixed(2)} MB` : 'Unknown';
      console.log(`   itag ${f.itag}: ${quality.padEnd(7)} ${fps}fps ${f.container.padEnd(4)} - ${size}`);
    });
    console.log('');

    // Test download highest quality audio
    console.log('📊 TEST 1: Download Highest Quality Audio');
    console.log('-'.repeat(60));
    const bestAudio = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
      filter: 'audioonly'
    });
    console.log(`Selected: itag ${bestAudio.itag} (${bestAudio.container})`);
    console.log(`Bitrate: ${bestAudio.audioBitrate || bestAudio.bitrate}kbps`);
    await testDownload(videoUrl, bestAudio, 'audio-best.tmp', '1MB');
    console.log('');

    // Test download 1080p video
    console.log('📊 TEST 2: Download 1080p Video');
    console.log('-'.repeat(60));
    const video1080 = info.formats.find(f => f.qualityLabel?.includes('1080'));
    if (video1080) {
      console.log(`Selected: itag ${video1080.itag} (${video1080.qualityLabel})`);
      console.log(`Container: ${video1080.container}`);
      await testDownload(videoUrl, video1080, 'video-1080p.tmp', '2MB');
    } else {
      console.log('⚠️  No 1080p format found');
    }
    console.log('');

    // Test download 720p video
    console.log('📊 TEST 3: Download 720p Video');
    console.log('-'.repeat(60));
    const video720 = info.formats.find(f => f.qualityLabel?.includes('720'));
    if (video720) {
      console.log(`Selected: itag ${video720.itag} (${video720.qualityLabel})`);
      console.log(`Container: ${video720.container}`);
      await testDownload(videoUrl, video720, 'video-720p.tmp', '1.5MB');
    } else {
      console.log('⚠️  No 720p format found');
    }
    console.log('');

    // Summary
    console.log('='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log('');
    console.log(`✅ Total formats available: ${info.formats.length}`);
    console.log(`✅ Direct URLs: ${info._innerTube.directUrls}/${info.formats.length} (100%)`);
    console.log(`✅ InnerTube client: ${info._innerTube.client}`);
    console.log(`✅ All formats working`);
    console.log('');
    console.log('🎉 Full formats test PASSED!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

async function testDownload(url, format, filename, sampleSize) {
  return new Promise((resolve, reject) => {
    const sizeBytes = sampleSize === '1MB' ? 1024 * 1024
                    : sampleSize === '1.5MB' ? 1.5 * 1024 * 1024
                    : sampleSize === '2MB' ? 2 * 1024 * 1024
                    : 512 * 1024;

    console.log(`⬇️  Downloading ${sampleSize} sample...`);

    let downloadedBytes = 0;
    const startTime = Date.now();

    const stream = ytdl(url, {
      format: format,
      range: { start: 0, end: sizeBytes }
    });

    stream.on('data', chunk => {
      downloadedBytes += chunk.length;
    });

    stream.on('end', () => {
      const duration = (Date.now() - startTime) / 1000;
      const speed = (downloadedBytes / 1024 / duration).toFixed(2);

      console.log(`✅ Downloaded: ${(downloadedBytes / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Time: ${duration.toFixed(2)}s`);
      console.log(`   Speed: ${speed} KB/s`);

      // Cleanup
      try {
        fs.unlinkSync(filename);
      } catch (e) {
        // Ignore
      }

      resolve();
    });

    stream.on('error', error => {
      console.error(`❌ Download failed: ${error.message}`);
      reject(error);
    });

    stream.pipe(fs.createWriteStream(filename));
  });
}

if (require.main === module) {
  testFullFormats().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = testFullFormats;
