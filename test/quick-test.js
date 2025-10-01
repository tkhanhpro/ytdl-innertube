const ytdl = require('../src/index');

async function quickTest() {
  const url = process.argv[2] || 'https://youtu.be/dQw4w9WgXcQ';

  console.log('🔥 Quick Test');
  console.log('URL:', url);
  console.log('');

  try {
    console.log('📊 Getting info...');
    const startTime = Date.now();
    const info = await ytdl.getInfo(url);
    const duration = Date.now() - startTime;

    console.log('✅ Success!');
    console.log('');
    console.log('📹 Video Details:');
    console.log(`   Title: ${info.videoDetails.title}`);
    console.log(`   Author: ${info.videoDetails.author}`);
    console.log(`   Duration: ${info.videoDetails.lengthSeconds}s`);
    console.log(`   View Count: ${info.videoDetails.viewCount}`);
    console.log('');
    console.log('📊 Format Stats:');
    console.log(`   Total formats: ${info.formats.length}`);
    console.log(`   Audio-only: ${info.formats.filter(f => f.hasAudio && !f.hasVideo).length}`);
    console.log(`   Video-only: ${info.formats.filter(f => f.hasVideo && !f.hasAudio).length}`);
    console.log(`   Combined: ${info.formats.filter(f => f.hasVideo && f.hasAudio).length}`);
    console.log('');
    console.log('🚀 InnerTube Stats:');
    console.log(`   Client: ${info._innerTube.client}`);
    console.log(`   Direct URLs: ${info._innerTube.directUrls}/${info.formats.length}`);
    console.log(`   Needs cipher: ${info._innerTube.needsCipher}`);
    console.log(`   Time: ${duration}ms`);
    console.log('');
    console.log('🎉 Test passed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.attempts) {
      console.error('');
      console.error('🔄 Client attempts:');
      error.attempts.forEach(attempt => {
        console.error(`   ${attempt.client}: ${attempt.success ? '✅' : '❌'} ${attempt.error || ''}`);
      });
    }
    console.error('');
    console.error('Stack:', error.stack);
  }
}

quickTest();
