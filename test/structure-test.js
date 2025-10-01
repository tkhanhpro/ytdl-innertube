console.log('🧪 Package Structure Test');
console.log('='.repeat(60));

// Test main export
console.log('\n📦 Testing main export...');
const ytdl = require('../src/index');
console.log('✅ Main export works');

// Test submodule exports
console.log('\n📦 Testing submodule exports...');

try {
  const { CLIENTS } = require('../src/core/innertube');
  console.log(`✅ core/innertube: ${Object.keys(CLIENTS).length} clients`);
} catch (e) {
  console.log(`❌ core/innertube: ${e.message}`);
}

try {
  const { getInfo } = require('../src/info');
  console.log('✅ info module: getInfo function');
} catch (e) {
  console.log(`❌ info module: ${e.message}`);
}

try {
  const { chooseFormat, filterFormats } = require('../src/formats');
  console.log('✅ formats module: chooseFormat, filterFormats functions');
} catch (e) {
  console.log(`❌ formats module: ${e.message}`);
}

try {
  const { validateURL, getVideoID } = require('../src/utils/url');
  console.log('✅ utils/url module: validateURL, getVideoID functions');
} catch (e) {
  console.log(`❌ utils/url module: ${e.message}`);
}

try {
  const { downloadFromInfo } = require('../src/download');
  console.log('✅ download module: downloadFromInfo function');
} catch (e) {
  console.log(`❌ download module: ${e.message}`);
}

// Test main API
console.log('\n📦 Testing main API...');
const api = [
  'getInfo',
  'chooseFormat',
  'filterFormats',
  'validateID',
  'validateURL',
  'getURLVideoID',
  'getVideoID',
  'downloadFromInfo',
  'INNERTUBE_CLIENTS',
  'version'
];

api.forEach(method => {
  if (ytdl[method]) {
    console.log(`✅ ytdl.${method}`);
  } else {
    console.log(`❌ ytdl.${method} missing`);
  }
});

console.log('\n🎉 Structure test completed!');
