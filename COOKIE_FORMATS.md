# Cookie Formats Guide

ytdl-innertube supports multiple cookie formats for authentication.

## 📋 Supported Formats

### 1. Cookie String

Simple semicolon-separated format:

```javascript
const cookies = ytdl.createCookieManager();
cookies.loadFromString('CONSENT=YES+1; VISITOR_INFO1_LIVE=xyz123; PREF=f6=8');
```

**File format** (cookies.txt):
```
CONSENT=YES+1; VISITOR_INFO1_LIVE=xyz123; PREF=f6=8
```

### 2. Object Format

JavaScript object with name-value pairs:

```javascript
const cookies = ytdl.createCookieManager();
cookies.loadFromObject({
  CONSENT: 'YES+1',
  VISITOR_INFO1_LIVE: 'xyz123',
  PREF: 'f6=8'
});
```

**JSON file format** (cookies.json):
```json
{
  "CONSENT": "YES+1",
  "VISITOR_INFO1_LIVE": "xyz123",
  "PREF": "f6=8"
}
```

### 3. Array Format (Simple)

Array of cookie strings:

```javascript
const cookies = ytdl.createCookieManager();
cookies.loadFromArray([
  'CONSENT=YES+1',
  'VISITOR_INFO1_LIVE=xyz123',
  'PREF=f6=8'
]);
```

**JSON file format** (cookies.json):
```json
[
  "CONSENT=YES+1",
  "VISITOR_INFO1_LIVE=xyz123",
  "PREF=f6=8"
]
```

### 4. State Array Format

Array of objects with name/value pairs (most common for extensions):

**Variant A** - `name/value`:
```javascript
cookies.loadFromArray([
  { name: 'CONSENT', value: 'YES+1' },
  { name: 'VISITOR_INFO1_LIVE', value: 'xyz123' },
  { name: 'PREF', value: 'f6=8' }
]);
```

**Variant B** - `Name/Value` (uppercase):
```javascript
cookies.loadFromArray([
  { Name: 'CONSENT', Value: 'YES+1' },
  { Name: 'VISITOR_INFO1_LIVE', Value: 'xyz123' }
]);
```

**Variant C** - `key/val`:
```javascript
cookies.loadFromArray([
  { key: 'CONSENT', val: 'YES+1' },
  { key: 'VISITOR_INFO1_LIVE', val: 'xyz123' }
]);
```

**JSON file format** (cookies.json):
```json
[
  { "name": "CONSENT", "value": "YES+1" },
  { "name": "VISITOR_INFO1_LIVE", "value": "xyz123" },
  { "name": "PREF", "value": "f6=8" }
]
```

### 5. Netscape Format

Standard cookies.txt format from browser extensions:

```javascript
cookies.loadFromNetscapeFile('cookies.txt');
// or
cookies.parseNetscapeFormat(netscapeContent);
```

**File format** (cookies.txt):
```
# Netscape HTTP Cookie File
.youtube.com	TRUE	/	FALSE	1234567890	CONSENT	YES+1
.youtube.com	TRUE	/	FALSE	1234567890	VISITOR_INFO1_LIVE	xyz123
.youtube.com	TRUE	/	FALSE	1234567890	PREF	f6=8
```

### 6. Mixed Array Format

Combine different formats in one array:

```javascript
cookies.loadFromArray([
  'CONSENT=YES+1',
  { name: 'VISITOR_INFO1_LIVE', value: 'xyz123' },
  { Name: 'PREF', Value: 'f6=8' },
  { key: 'GPS', val: '1' }
]);
```

## 🔧 API Reference

### CookieManager Methods

```javascript
const cookies = ytdl.createCookieManager();

// Load methods
cookies.loadFromString(str)           // Cookie string
cookies.loadFromObject(obj)           // JavaScript object
cookies.loadFromArray(arr)            // Array of cookies
cookies.loadFromFile(path)            // File with cookie string
cookies.loadFromJSON(path)            // JSON file (object or array)
cookies.loadFromNetscapeFile(path)    // Netscape cookies.txt
cookies.parseNetscapeFormat(content)  // Parse Netscape content

// Get methods
cookies.getCookieString()             // Get as string
cookies.getCookie(name)               // Get single cookie
cookies.toJSON()                      // Get as object

// Set/manage methods
cookies.setCookie(name, value)        // Set single cookie
cookies.hasCookies()                  // Check if has cookies
cookies.clear()                       // Clear all cookies
```

## 📦 Usage Examples

### Basic Usage

```javascript
const ytdl = require('ytdl-innertube');

// Create cookie manager
const cookies = ytdl.createCookieManager();

// Load cookies (any format)
cookies.loadFromString('NAME=VALUE; NAME2=VALUE2');

// Use with getInfo
const info = await ytdl.getInfo('VIDEO_URL', { cookies });

// Use with download
ytdl('VIDEO_URL', { cookies, quality: 'highestaudio' })
  .pipe(fs.createWriteStream('audio.m4a'));
```

### From Browser Extension

Most browser extensions export in state array format:

```javascript
// cookies.json from extension
[
  { "name": "CONSENT", "value": "YES+1" },
  { "name": "VISITOR_INFO1_LIVE", "value": "xyz123" }
]

// Load it
cookies.loadFromJSON('cookies.json');
```

### From EditThisCookie Extension

EditThisCookie exports in JSON state array format:

```javascript
cookies.loadFromJSON('editthiscookie.json');
```

### From Get cookies.txt Extension

This extension exports in Netscape format:

```javascript
cookies.loadFromNetscapeFile('cookies.txt');
```

## 🌐 Browser Export Guide

### Chrome/Edge

**Method 1: EditThisCookie Extension**
1. Install "EditThisCookie" extension
2. Go to YouTube
3. Click extension icon
4. Click "Export" → Copy JSON
5. Save to file and use `loadFromJSON()`

**Method 2: Get cookies.txt Extension**
1. Install "Get cookies.txt" extension
2. Go to YouTube
3. Click extension icon
4. Click "Export" → Save file
5. Use `loadFromNetscapeFile('cookies.txt')`

### Firefox

**Cookie Quick Manager Extension**
1. Install "Cookie Quick Manager"
2. Go to YouTube
3. Open extension
4. Export cookies as JSON
5. Use `loadFromJSON()`

### Manual Export

1. Open DevTools (F12)
2. Go to Application → Cookies → https://www.youtube.com
3. Copy cookie values manually
4. Create object:
```javascript
cookies.loadFromObject({
  CONSENT: 'value_from_devtools',
  VISITOR_INFO1_LIVE: 'value_from_devtools',
  // ... other cookies
});
```

## ⚠️ Important Notes

### Required Cookies for YouTube

Most important cookies for authentication:
- `VISITOR_INFO1_LIVE` - Visitor ID
- `CONSENT` - Cookie consent
- `PREF` - User preferences
- `LOGIN_INFO` - Login state (if logged in)
- `SAPISID` - API session ID (if logged in)

### Security

- **Never commit cookies to git**
- Add `*.cookies.txt` and `*.cookies.json` to `.gitignore`
- Store cookies securely
- Cookies expire - may need to refresh

### Privacy

Cookies may contain:
- Login session tokens
- Personal preferences
- Tracking identifiers

Only use cookies from your own YouTube account.

## 🧪 Testing

Test your cookie format:

```javascript
const ytdl = require('ytdl-innertube');
const cookies = ytdl.createCookieManager();

// Load your cookies
cookies.loadFromFile('my-cookies.txt');

// Check if loaded correctly
console.log('Cookies:', cookies.toJSON());
console.log('String:', cookies.getCookieString());
console.log('Has cookies:', cookies.hasCookies());

// Test with video
try {
  const info = await ytdl.getInfo('VIDEO_URL', { cookies });
  console.log('✅ Cookies working!');
} catch (error) {
  console.log('❌ Cookie error:', error.message);
}
```

## 📝 Format Comparison

| Format | Easy to Edit | Extension Support | File Format | Best For |
|--------|-------------|-------------------|-------------|----------|
| String | ✅ Yes | ❌ No | .txt | Manual entry |
| Object | ✅ Yes | ✅ Some | .json | Manual coding |
| Array (simple) | ✅ Yes | ❌ No | .json | Manual coding |
| State Array | ⚠️ Medium | ✅ Yes | .json | Extensions |
| Netscape | ❌ No | ✅ Yes | .txt | Extensions |
| Mixed | ❌ No | ❌ No | - | Advanced |

## 🎯 Recommendations

**For beginners**: Use browser extension with JSON export
```javascript
cookies.loadFromJSON('cookies.json');
```

**For automation**: Use Netscape format from extensions
```javascript
cookies.loadFromNetscapeFile('cookies.txt');
```

**For manual setup**: Use simple string format
```javascript
cookies.loadFromString('NAME=VALUE; NAME2=VALUE2');
```

**For development**: Use object format in code
```javascript
cookies.loadFromObject({ NAME: 'VALUE' });
```
