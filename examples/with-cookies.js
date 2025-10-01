const ytdl = require('../src/index');
const fs = require('fs');

async function exampleWithCookies() {
  console.log('🍪 ytdl-innertube - Cookie Authentication Example');
  console.log('='.repeat(60));
  console.log('');

  const cookieManager = ytdl.createCookieManager();

  // Method 1: Cookie String
  console.log('📊 Method 1: Cookie String');
  cookieManager.loadFromString('CONSENT=YES+1; VISITOR_INFO1_LIVE=xyz123');
  console.log('✅ Loaded from string');
  console.log('');

  // Method 2: Object
  console.log('📊 Method 2: Object Format');
  cookieManager.loadFromObject({
    CONSENT: 'YES+1',
    VISITOR_INFO1_LIVE: 'xyz123'
  });
  console.log('✅ Loaded from object');
  console.log('');

  // Method 3: Array (State Array)
  console.log('📊 Method 3: State Array');
  cookieManager.loadFromArray([
    { name: 'CONSENT', value: 'YES+1' },
    { name: 'VISITOR_INFO1_LIVE', value: 'xyz123' }
  ]);
  console.log('✅ Loaded from state array');
  console.log('   Supports: name/value, Name/Value, key/val');
  console.log('');

  // Method 4: File (String format)
  console.log('📊 Method 4: Load from File');
  console.log('   cookieManager.loadFromFile("cookies.txt")');
  console.log('   Format: NAME1=VALUE1; NAME2=VALUE2');
  console.log('');

  // Method 5: JSON File
  console.log('📊 Method 5: Load from JSON');
  console.log('   cookieManager.loadFromJSON("cookies.json")');
  console.log('   Supports: Object or Array format');
  console.log('');

  // Method 6: Netscape Format
  console.log('📊 Method 6: Netscape Format (cookies.txt export)');
  console.log('   cookieManager.loadFromNetscapeFile("cookies.txt")');
  console.log('   Standard format from browser extensions');
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
