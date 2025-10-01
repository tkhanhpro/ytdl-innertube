const ytdl = require('../src/index');
const fs = require('fs');

async function runTests() {
  console.log('🧪 ytdl-innertube - Test Suite');
  console.log('='.repeat(60));
  console.log('');

  const testResults = {
    validateURL: false,
    getURLVideoID: false,
    getInfo: false,
    chooseFormat: false,
    filterFormats: false,
    download: false
  };

  try {
    const videoUrl = 'https://youtu.be/dQw4w9WgXcQ';
    const videoId = 'dQw4w9WgXcQ';

    // TEST 1: validateURL
    console.log('📊 TEST 1: validateURL()');
    console.log('-'.repeat(60));
    const isValid = ytdl.validateURL(videoUrl);
    const isInvalid = ytdl.validateURL('https://example.com');
    testResults.validateURL = isValid === true && isInvalid === false;
    console.log(`   Valid URL: ${isValid ? '✅' : '❌'}`);
    console.log(`   Invalid URL: ${!isInvalid ? '✅' : '❌'}`);
    console.log('');

    // TEST 2: getURLVideoID
    console.log('📊 TEST 2: getURLVideoID()');
    console.log('-'.repeat(60));
    const extractedId = ytdl.getURLVideoID(videoUrl);
    testResults.getURLVideoID = extractedId === videoId;
    console.log(`   Extracted ID: ${extractedId === videoId ? '✅' : '❌'} (${extractedId})`);
    console.log('');

    // TEST 3: getInfo
    console.log('📊 TEST 3: getInfo()');
    console.log('-'.repeat(60));
    const startTime = Date.now();
    const info = await ytdl.getInfo(videoUrl);
    const duration = Date.now() - startTime;

    testResults.getInfo = info && info.videoDetails && info.formats && info.formats.length > 0;

    console.log(`   Time: ${duration}ms`);
    console.log(`   Title: ${info.videoDetails.title ? '✅' : '❌'}`);
    console.log(`   Formats: ${info.formats.length > 0 ? '✅' : '❌'} (${info.formats.length})`);

    if (info._innerTube) {
      console.log(`   InnerTube: ✅ ${info._innerTube.client}`);
      console.log(`   Direct URLs: ${info._innerTube.directUrls}/${info.formats.length}`);
    }
    console.log('');

    // TEST 4: chooseFormat
    console.log('📊 TEST 4: chooseFormat()');
    console.log('-'.repeat(60));
    const audioFormat = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
      filter: 'audioonly'
    });
    const videoFormat = ytdl.chooseFormat(info.formats, {
      quality: 'highestvideo',
      filter: 'videoonly'
    });
    testResults.chooseFormat = audioFormat && videoFormat;
    console.log(`   Audio format: ${audioFormat ? '✅' : '❌'} (itag ${audioFormat?.itag})`);
    console.log(`   Video format: ${videoFormat ? '✅' : '❌'} (itag ${videoFormat?.itag})`);
    console.log('');

    // TEST 5: filterFormats
    console.log('📊 TEST 5: filterFormats()');
    console.log('-'.repeat(60));
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const videoFormats = ytdl.filterFormats(info.formats, 'videoonly');
    testResults.filterFormats = audioFormats.length > 0 && videoFormats.length > 0;
    console.log(`   Audio formats: ${audioFormats.length > 0 ? '✅' : '❌'} (${audioFormats.length})`);
    console.log(`   Video formats: ${videoFormats.length > 0 ? '✅' : '❌'} (${videoFormats.length})`);
    console.log('');

    // TEST 6: Download
    console.log('📊 TEST 6: Download Stream');
    console.log('-'.repeat(60));
    const downloadFormat = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
      filter: 'audioonly'
    });

    console.log(`   Format: itag ${downloadFormat.itag} (${downloadFormat.container})`);

    await new Promise((resolve, reject) => {
      let downloadedBytes = 0;
      const outputFile = 'test-download.tmp';
      const downloadStart = Date.now();

      const stream = ytdl(videoUrl, {
        format: downloadFormat,
        range: { start: 0, end: 256 * 1024 } // 256KB sample
      });

      stream.on('data', chunk => {
        downloadedBytes += chunk.length;
      });

      stream.on('end', () => {
        const downloadTime = (Date.now() - downloadStart) / 1000;
        const speed = (downloadedBytes / 1024 / downloadTime).toFixed(2);

        console.log(`   Downloaded: ${(downloadedBytes / 1024).toFixed(2)} KB`);
        console.log(`   Speed: ${speed} KB/s`);
        console.log(`   Status: ✅`);

        testResults.download = downloadedBytes > 0;

        // Cleanup
        try {
          fs.unlinkSync(outputFile);
        } catch (e) {
          // Ignore
        }

        resolve();
      });

      stream.on('error', reject);
      stream.pipe(fs.createWriteStream(outputFile));
    });

    console.log('');

    // RESULTS
    console.log('='.repeat(60));
    console.log('📊 TEST RESULTS');
    console.log('='.repeat(60));
    console.log('');

    const results = [
      { name: 'validateURL()', status: testResults.validateURL },
      { name: 'getURLVideoID()', status: testResults.getURLVideoID },
      { name: 'getInfo()', status: testResults.getInfo },
      { name: 'chooseFormat()', status: testResults.chooseFormat },
      { name: 'filterFormats()', status: testResults.filterFormats },
      { name: 'Download Stream', status: testResults.download }
    ];

    results.forEach(test => {
      const status = test.status ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} - ${test.name}`);
    });

    const passCount = results.filter(r => r.status).length;
    const totalCount = results.length;

    console.log('');
    console.log(`📊 Total: ${passCount}/${totalCount} tests passed (${(passCount/totalCount*100).toFixed(1)}%)`);
    console.log('');

    if (passCount === totalCount) {
      console.log('🎉 ALL TESTS PASSED!');
      console.log('✅ Package is working correctly');
      process.exit(0);
    } else {
      console.log('⚠️  Some tests failed');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = runTests;
