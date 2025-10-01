const ytdl = require('../src/index');
const fs = require('fs');

async function exampleWithCookies() {
  console.log('🍪 ytdl-innertube - Cookie Authentication Example');
  console.log('='.repeat(60));
  console.log('');

  // Method 1: Load from cookie string
  console.log('📊 Method 1: Cookie String');
  const cookieManager = ytdl.createCookieManager();
  cookieManager.loadFromString('CONSENT=YES+1; VISITOR_INFO1_LIVE=xyz123');
  console.log('✅ Cookies loaded from string');
  console.log(`   Cookies: ${Object.keys(cookieManager.cookies).join(', ')}`);
  console.log('');

  // Method 2: Load from file
  console.log('📊 Method 2: Load from File');
  console.log('   Create a file "youtube_cookies.txt" with your cookies');
  console.log('   Format: NAME1=VALUE1; NAME2=VALUE2');
  console.log('');

  // Method 3: Load from JSON
  console.log('📊 Method 3: Load from JSON');
  console.log('   Create a file "youtube_cookies.json":');
  console.log('   {');
  console.log('     "CONSENT": "YES+1",');
  console.log('     "VISITOR_INFO1_LIVE": "xyz123"');
  console.log('   }');
  console.log('');

  // Usage example
  console.log('📊 Usage Example');
  console.log('-'.repeat(60));

  const videoUrl = 'https://youtu.be/dQw4w9WgXcQ';

  try {
    console.log('Getting video info with cookies...');

    // Pass cookies to getInfo
    const info = await ytdl.getInfo(videoUrl, {
      cookies: cookieManager
    });

    console.log('✅ Success!');
    console.log(`   Title: ${info.videoDetails.title}`);
    console.log(`   Formats: ${info.formats.length}`);
    console.log('');

    // Download with cookies
    console.log('Downloading with cookies...');
    ytdl(videoUrl, {
      cookies: cookieManager,
      quality: 'highestaudio',
      range: { start: 0, end: 100 * 1024 }
    })
      .on('info', (info, format) => {
        console.log(`✅ Started download: itag ${format.itag}`);
      })
      .on('end', () => {
        console.log('✅ Download complete!');
        console.log('');
        console.log('🎉 Cookie example completed!');
      })
      .on('error', err => {
        console.error('❌ Download error:', err.message);
      })
      .pipe(fs.createWriteStream('cookie-test.tmp'));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// How to export cookies from browser
console.log('📚 How to Export Cookies from Browser:');
console.log('');
console.log('Option 1: Browser Extensions');
console.log('  - Chrome/Edge: "Get cookies.txt" or "EditThisCookie"');
console.log('  - Firefox: "cookies.txt" extension');
console.log('');
console.log('Option 2: Developer Tools');
console.log('  1. Open YouTube in your browser');
console.log('  2. Press F12 to open DevTools');
console.log('  3. Go to Application → Cookies → https://www.youtube.com');
console.log('  4. Copy cookie values manually');
console.log('');
console.log('Option 3: Export as JSON');
console.log('  Use browser extension to export as JSON format');
console.log('');
console.log('='.repeat(60));
console.log('');

if (require.main === module) {
  exampleWithCookies().catch(console.error);
}

module.exports = exampleWithCookies;
