const ytdl = require('../src/index');

console.log('🍪 Cookie Manager Test');
console.log('='.repeat(60));
console.log('');

// Test 1: String format
console.log('📊 TEST 1: Cookie String');
console.log('-'.repeat(60));
const cookies1 = ytdl.createCookieManager();
cookies1.loadFromString('CONSENT=YES+1; VISITOR_INFO1_LIVE=xyz123; PREF=f6=8');
console.log('✅ Loaded from string');
console.log(`   Cookies: ${JSON.stringify(cookies1.toJSON(), null, 2)}`);
console.log(`   String: ${cookies1.getCookieString()}`);
console.log('');

// Test 2: Object format
console.log('📊 TEST 2: Object Format');
console.log('-'.repeat(60));
const cookies2 = ytdl.createCookieManager();
cookies2.loadFromObject({
  CONSENT: 'YES+1',
  VISITOR_INFO1_LIVE: 'xyz123',
  PREF: 'f6=8'
});
console.log('✅ Loaded from object');
console.log(`   Cookies: ${JSON.stringify(cookies2.toJSON(), null, 2)}`);
console.log('');

// Test 3: Array format (simple)
console.log('📊 TEST 3: Array Format (Simple)');
console.log('-'.repeat(60));
const cookies3 = ytdl.createCookieManager();
cookies3.loadFromArray([
  'CONSENT=YES+1',
  'VISITOR_INFO1_LIVE=xyz123',
  'PREF=f6=8'
]);
console.log('✅ Loaded from simple array');
console.log(`   Cookies: ${JSON.stringify(cookies3.toJSON(), null, 2)}`);
console.log('');

// Test 4: Array format (objects with name/value)
console.log('📊 TEST 4: Array Format (State Array - name/value)');
console.log('-'.repeat(60));
const cookies4 = ytdl.createCookieManager();
cookies4.loadFromArray([
  { name: 'CONSENT', value: 'YES+1' },
  { name: 'VISITOR_INFO1_LIVE', value: 'xyz123' },
  { name: 'PREF', value: 'f6=8' }
]);
console.log('✅ Loaded from state array (name/value)');
console.log(`   Cookies: ${JSON.stringify(cookies4.toJSON(), null, 2)}`);
console.log('');

// Test 5: Array format (objects with Name/Value - uppercase)
console.log('📊 TEST 5: Array Format (State Array - Name/Value uppercase)');
console.log('-'.repeat(60));
const cookies5 = ytdl.createCookieManager();
cookies5.loadFromArray([
  { Name: 'CONSENT', Value: 'YES+1' },
  { Name: 'VISITOR_INFO1_LIVE', Value: 'xyz123' },
  { Name: 'PREF', Value: 'f6=8' }
]);
console.log('✅ Loaded from state array (Name/Value)');
console.log(`   Cookies: ${JSON.stringify(cookies5.toJSON(), null, 2)}`);
console.log('');

// Test 6: Array format (objects with key/val)
console.log('📊 TEST 6: Array Format (State Array - key/val)');
console.log('-'.repeat(60));
const cookies6 = ytdl.createCookieManager();
cookies6.loadFromArray([
  { key: 'CONSENT', val: 'YES+1' },
  { key: 'VISITOR_INFO1_LIVE', val: 'xyz123' },
  { key: 'PREF', val: 'f6=8' }
]);
console.log('✅ Loaded from state array (key/val)');
console.log(`   Cookies: ${JSON.stringify(cookies6.toJSON(), null, 2)}`);
console.log('');

// Test 7: Netscape format
console.log('📊 TEST 7: Netscape Format (cookies.txt)');
console.log('-'.repeat(60));
const netscapeContent = `# Netscape HTTP Cookie File
.youtube.com	TRUE	/	FALSE	1234567890	CONSENT	YES+1
.youtube.com	TRUE	/	FALSE	1234567890	VISITOR_INFO1_LIVE	xyz123
.youtube.com	TRUE	/	FALSE	1234567890	PREF	f6=8`;

const cookies7 = ytdl.createCookieManager();
cookies7.parseNetscapeFormat(netscapeContent);
console.log('✅ Loaded from Netscape format');
console.log(`   Cookies: ${JSON.stringify(cookies7.toJSON(), null, 2)}`);
console.log('');

// Test 8: Mixed format array
console.log('📊 TEST 8: Mixed Format Array');
console.log('-'.repeat(60));
const cookies8 = ytdl.createCookieManager();
cookies8.loadFromArray([
  'CONSENT=YES+1',
  { name: 'VISITOR_INFO1_LIVE', value: 'xyz123' },
  { Name: 'PREF', Value: 'f6=8' },
  { key: 'GPS', val: '1' }
]);
console.log('✅ Loaded from mixed array');
console.log(`   Cookies: ${JSON.stringify(cookies8.toJSON(), null, 2)}`);
console.log('');

// Summary
console.log('='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));
console.log('');
console.log('✅ Supported formats:');
console.log('   1. String: "NAME=VALUE; NAME2=VALUE2"');
console.log('   2. Object: { NAME: "VALUE", NAME2: "VALUE2" }');
console.log('   3. Array (strings): ["NAME=VALUE", "NAME2=VALUE2"]');
console.log('   4. Array (objects): [{ name: "NAME", value: "VALUE" }]');
console.log('   5. Array (uppercase): [{ Name: "NAME", Value: "VALUE" }]');
console.log('   6. Array (key/val): [{ key: "NAME", val: "VALUE" }]');
console.log('   7. Netscape format (cookies.txt)');
console.log('   8. Mixed array format');
console.log('');
console.log('🎉 All cookie formats supported!');
