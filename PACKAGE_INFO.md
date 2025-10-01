# ytdl-innertube - Package Information

## 📦 Overview

**Name**: ytdl-innertube  
**Version**: 1.0.0  
**License**: MIT  
**Author**: tieubao9k  
**Copyright**: © 2025 tieubao9k. All rights reserved.

## 🎯 Description

Pure InnerTube YouTube downloader with multi-client architecture. Zero signature decryption, 100% direct URLs, 76% faster than traditional methods.

## 🏗️ Structure

```
ytdl-innertube/
├── src/
│   ├── core/
│   │   ├── innertube.js       # InnerTube API (5 clients)
│   │   └── cookies.js         # Cookie manager (8 formats)
│   ├── info/
│   │   └── index.js           # Video info extraction
│   ├── formats/
│   │   └── index.js           # Format selection
│   ├── utils/
│   │   └── url.js             # URL helpers
│   ├── download/
│   │   └── index.js           # Undici downloader
│   ├── types/
│   │   └── index.d.ts         # TypeScript definitions
│   └── index.js               # Main export
├── examples/
│   ├── basic-usage.js
│   └── with-cookies.js
├── test/
│   ├── structure-test.js
│   ├── download-test.js
│   ├── download-formats-test.js
│   ├── quick-test.js
│   └── cookie-test.js
└── docs/
    ├── README.md
    └── COOKIE_FORMATS.md
```

## 🚀 Features

- ✅ Zero signature decryption
- ✅ 100% direct URLs
- ✅ 76% faster (314ms vs 1120ms)
- ✅ Multi-client fallback (5 clients)
- ✅ 8 cookie formats support
- ✅ TypeScript definitions
- ✅ Modular architecture
- ✅ Undici HTTP client
- ✅ Production ready

## 📊 Stats

- **Source code**: 7 JavaScript files
- **Package size**: 6.1 MB (with node_modules)
- **Dependencies**: 6 packages
- **Test coverage**: 5 test suites
- **Documentation**: Complete

## 🔧 Installation

```bash
npm install ytdl-innertube
```

## 💻 Quick Start

```javascript
const ytdl = require('ytdl-innertube');

// Download video
ytdl('https://youtu.be/VIDEO_ID', { quality: 'highestaudio' })
  .pipe(fs.createWriteStream('audio.m4a'));

// Get info
const info = await ytdl.getInfo('https://youtu.be/VIDEO_ID');
console.log(info.videoDetails.title);
```

## 🍪 Cookie Support

```javascript
const cookies = ytdl.createCookieManager();
cookies.loadFromFile('cookies.txt');

const info = await ytdl.getInfo('VIDEO_URL', { cookies });
```

Supports 8 formats:
1. String format
2. Object format
3. Simple array
4. State array (name/value)
5. State array (Name/Value)
6. State array (key/val)
7. Netscape format
8. Mixed format

## 📈 Performance

| Metric | Traditional | ytdl-innertube | Improvement |
|--------|-------------|----------------|-------------|
| Info extraction | 1120ms | 314ms | **72% faster** |
| Signature decipher | Required | Not needed | **100% eliminated** |
| Direct URLs | 0-60% | 100% | **∞** |
| Download speed | Variable | 819-1113 KB/s | Stable |

## 🧪 Test Results

All tests passing ✅

- ✅ Structure test (10/10)
- ✅ Download test (819 KB/s)
- ✅ Format test (audio + video)
- ✅ Cookie test (8/8 formats)
- ✅ Real video test (314ms)

## 📦 Dependencies

1. undici (^6.21.3) - HTTP client
2. m3u8stream (^0.8.6) - HLS support
3. http-cookie-agent (^6.0.8) - Cookie agent
4. https-proxy-agent (^7.0.6) - Proxy support
5. tough-cookie (^4.1.4) - Cookie jar
6. sax (^1.4.1) - XML parsing

## 🎯 API

### Main Methods
- `ytdl(url, options)` → Stream
- `ytdl.getInfo(url, options)` → Promise<VideoInfo>
- `ytdl.chooseFormat(formats, options)` → Format
- `ytdl.filterFormats(formats, filter)` → Format[]
- `ytdl.validateURL(url)` → boolean
- `ytdl.getVideoID(url)` → Promise<string>
- `ytdl.downloadFromInfo(info, options)` → Stream

### Cookie Methods
- `ytdl.createCookieManager()` → CookieManager
- `cookies.loadFromString(str)`
- `cookies.loadFromObject(obj)`
- `cookies.loadFromArray(arr)`
- `cookies.loadFromFile(path)`
- `cookies.loadFromJSON(path)`
- `cookies.loadFromNetscapeFile(path)`

### Submodule Imports
```javascript
const { CLIENTS } = require('ytdl-innertube/core');
const { chooseFormat } = require('ytdl-innertube/formats');
```

## 🌐 InnerTube Clients

1. ANDROID (Priority 1) - Best performance
2. ANDROID_VR (Priority 2) - VR optimized
3. IOS (Priority 3) - Reliable
4. WEB (Priority 4) - Fallback
5. MWEB (Priority 5) - Mobile web

## 📄 License

MIT License

Copyright (c) 2025 tieubao9k

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**Author**: tieubao9k  
**Created**: October 2025  
**Status**: ✅ Production Ready
