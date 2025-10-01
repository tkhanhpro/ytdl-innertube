const ytdl = require('../src/index');
const fs = require('fs');

async function testDownloadFormats() {
  console.log('🔥 Format Download Test');
  console.log('='.repeat(60));
  console.log('');

  const videoUrl = process.argv[2] || 'https://youtu.be/O2w01las_9c';

  try {
    console.log('📊 Step 1: Getting video info...');
    const info = await ytdl.getInfo(videoUrl);
    console.log(`✅ Title: ${info.videoDetails.title}`);
    console.log(`✅ Formats: ${info.formats.length}`);
    console.log('');

    // TEST 1: Audio 128kbps (or closest)
    console.log('📊 TEST 1: Audio ~128kbps');
    console.log('-'.repeat(60));

    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    console.log(`Available audio formats: ${audioFormats.length}`);

    audioFormats.slice(0, 5).forEach(f => {
      const bitrate = f.audioBitrate || f.bitrate || 0;
      console.log(`  itag ${f.itag}: ${f.container} ${bitrate}kbps`);
    });

    // Select closest to 128kbps
    const targetBitrate = 128;
    const audioFormat = audioFormats.sort((a, b) => {
      const aBitrate = a.audioBitrate || a.bitrate || 0;
      const bBitrate = b.audioBitrate || b.bitrate || 0;
      return Math.abs(aBitrate - targetBitrate) - Math.abs(bBitrate - targetBitrate);
    })[0];

    console.log(`\n✅ Selected: itag ${audioFormat.itag} (${audioFormat.container})`);
    console.log(`   Bitrate: ${audioFormat.audioBitrate || audioFormat.bitrate}kbps`);
    console.log('');

    await testDownload(videoUrl, audioFormat, 'audio-128k-sample.tmp');

    // TEST 2: Video 360p
    console.log('📊 TEST 2: Video 360p');
    console.log('-'.repeat(60));

    const videoFormats = info.formats.filter(f => {
      const label = f.qualityLabel || '';
      return label.includes('360p') || label.includes('480p');
    });

    console.log(`Available 360p/480p formats: ${videoFormats.length}`);

    videoFormats.slice(0, 5).forEach(f => {
      console.log(`  itag ${f.itag}: ${f.qualityLabel} ${f.container} (${f.hasAudio ? 'audio+video' : 'video-only'})`);
    });

    // Prefer 360p with audio, fallback to 360p video-only
    let video360 = videoFormats.find(f => f.qualityLabel?.includes('360') && f.hasAudio);
    if (!video360) {
      video360 = videoFormats.find(f => f.qualityLabel?.includes('360'));
    }
    if (!video360 && videoFormats.length > 0) {
      video360 = videoFormats[0];
    }

    if (video360) {
      console.log(`\n✅ Selected: itag ${video360.itag} (${video360.qualityLabel})`);
      console.log(`   Container: ${video360.container}`);
      console.log(`   Type: ${video360.hasAudio && video360.hasVideo ? 'audio+video' : video360.hasVideo ? 'video-only' : 'audio-only'}`);
      console.log('');

      await testDownload(videoUrl, video360, 'video-360p-sample.tmp');
    } else {
      console.log('❌ No 360p format found');
    }

    console.log('');
    console.log('🎉 All format tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

async function testDownload(url, format, filename) {
  return new Promise((resolve, reject) => {
    console.log(`⬇️  Downloading 500KB sample...`);

    let downloadedBytes = 0;
    const startTime = Date.now();

    const stream = ytdl(url, {
      format: format,
      range: { start: 0, end: 512 * 1024 }
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
      console.log(`✅ Download complete!`);
      console.log(`   Size: ${(downloadedBytes / 1024).toFixed(2)} KB`);
      console.log(`   Time: ${duration.toFixed(2)}s`);
      console.log(`   Speed: ${speed} KB/s`);
      console.log('');

      // Cleanup
      try {
        fs.unlinkSync(filename);
        console.log(`🗑️  Cleaned up ${filename}`);
      } catch (e) {
        // Ignore
      }

      console.log('');
      resolve();
    });

    stream.on('error', error => {
      console.error('');
      console.error(`❌ Download failed: ${error.message}`);
      reject(error);
    });

    stream.pipe(fs.createWriteStream(filename));
  });
}

if (require.main === module) {
  testDownloadFormats().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = testDownloadFormats;
