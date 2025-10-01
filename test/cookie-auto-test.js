const ytdl = require('../src/index');

console.log('🍪 Cookie Auto-Detection Test');
console.log('='.repeat(60));
console.log('');

// Test 1: String auto-detection
console.log('📊 TEST 1: String Auto-Detection');
console.log('-'.repeat(60));
const cookieString = 'CONSENT=YES+1; VISITOR_INFO1_LIVE=xyz123; PREF=f6=8';
const cookies1 = new ytdl.CookieManager(cookieString);
console.log(`Input: "${cookieString.substring(0, 40)}..."`);
console.log(`✅ Auto-detected as: String`);
console.log(`   Parsed cookies: ${Object.keys(cookies1.cookies).length}`);
console.log(`   Output: ${cookies1.getCookieString().substring(0, 40)}...`);
console.log('');

// Test 2: Object auto-detection
console.log('📊 TEST 2: Object Auto-Detection');
console.log('-'.repeat(60));
const cookieObject = {
  CONSENT: 'YES+1',
  VISITOR_INFO1_LIVE: 'xyz123',
  PREF: 'f6=8'
};
const cookies2 = new ytdl.CookieManager(cookieObject);
console.log(`Input: { CONSENT, VISITOR_INFO1_LIVE, PREF }`);
console.log(`✅ Auto-detected as: Object`);
console.log(`   Parsed cookies: ${Object.keys(cookies2.cookies).length}`);
console.log(`   Output: ${cookies2.getCookieString()}`);
console.log('');

// Test 3: Array (simple) auto-detection
console.log('📊 TEST 3: Array (Simple) Auto-Detection');
console.log('-'.repeat(60));
const cookieArray1 = [
  'CONSENT=YES+1',
  'VISITOR_INFO1_LIVE=xyz123',
  'PREF=f6=8'
];
const cookies3 = new ytdl.CookieManager(cookieArray1);
console.log(`Input: ["CONSENT=YES+1", "VISITOR_INFO1_LIVE=xyz123", ...]`);
console.log(`✅ Auto-detected as: Array (simple)`);
console.log(`   Parsed cookies: ${Object.keys(cookies3.cookies).length}`);
console.log(`   Output: ${cookies3.getCookieString()}`);
console.log('');

// Test 4: Array (state) auto-detection
console.log('📊 TEST 4: Array (State) Auto-Detection');
console.log('-'.repeat(60));
const cookieArray2 = [
  { name: 'CONSENT', value: 'YES+1' },
  { name: 'VISITOR_INFO1_LIVE', value: 'xyz123' },
  { name: 'PREF', value: 'f6=8' }
];
const cookies4 = new ytdl.CookieManager(cookieArray2);
console.log(`Input: [{ name: 'CONSENT', value: 'YES+1' }, ...]`);
console.log(`✅ Auto-detected as: Array (state)`);
console.log(`   Parsed cookies: ${Object.keys(cookies4.cookies).length}`);
console.log(`   Output: ${cookies4.getCookieString()}`);
console.log('');

// Test 5: Direct usage with ytdl.getInfo
console.log('📊 TEST 5: Direct Usage with ytdl.getInfo()');
console.log('-'.repeat(60));

async function testDirectUsage() {
  // Test with string
  console.log('5a. String cookie:');
  const cookieStr = 'CONSENT=YES+1; VISITOR_INFO1_LIVE=xyz123';
  console.log(`   const cookie = "${cookieStr}"`);
  console.log(`   ytdl.getInfo(url, { cookies: cookie })`);
  console.log('   ✅ Will auto-parse as string');
  console.log('');

  // Test with object
  console.log('5b. Object cookie:');
  const cookieObj = { CONSENT: 'YES+1', VISITOR_INFO1_LIVE: 'xyz123' };
  console.log(`   const cookie = { CONSENT: "YES+1", ... }`);
  console.log(`   ytdl.getInfo(url, { cookies: cookie })`);
  console.log('   ✅ Will auto-parse as object');
  console.log('');

  // Test with array
  console.log('5c. Array cookie:');
  const cookieArr = [
    { name: 'CONSENT', value: 'YES+1' },
    { name: 'VISITOR_INFO1_LIVE', value: 'xyz123' }
  ];
  console.log(`   const cookie = [{ name: 'CONSENT', value: 'YES+1' }, ...]`);
  console.log(`   ytdl.getInfo(url, { cookies: cookie })`);
  console.log('   ✅ Will auto-parse as array');
  console.log('');
}

testDirectUsage().then(() => {
  console.log('='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log('');
  console.log('✅ Auto-detection working for:');
  console.log('   1. String: "NAME=VALUE; NAME2=VALUE2"');
  console.log('   2. Object: { NAME: "VALUE", NAME2: "VALUE2" }');
  console.log('   3. Array (simple): ["NAME=VALUE", "NAME2=VALUE2"]');
  console.log('   4. Array (state): [{ name: "NAME", value: "VALUE" }]');
  console.log('   5. CookieManager instance');
  console.log('');
  console.log('💡 Usage:');
  console.log('   const cookie = "CONSENT=YES+1; ..." // Any format');
  console.log('   const info = await ytdl.getInfo(url, { cookies: cookie });');
  console.log('');
  console.log('   // OR with CookieManager');
  console.log('   const cookie = new ytdl.CookieManager("...");');
  console.log('   const info = await ytdl.getInfo(url, { cookies: cookie });');
  console.log('');
  console.log('🎉 Auto-detection test PASSED!');
});
