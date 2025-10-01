const fs = require('fs');
const path = require('path');

class CookieManager {
  constructor() {
    this.cookies = {};
    this.cookieString = '';
  }

  loadFromString(cookieString) {
    this.cookieString = cookieString;
    this.parseCookies(cookieString);
    return this;
  }

  loadFromFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return this.loadFromString(content);
    } catch (error) {
      throw new Error(`Failed to load cookies from ${filePath}: ${error.message}`);
    }
  }

  loadFromJSON(jsonPath) {
    try {
      const content = fs.readFileSync(jsonPath, 'utf8');
      const data = JSON.parse(content);
      return this.loadFromObject(data);
    } catch (error) {
      throw new Error(`Failed to load cookies from JSON ${jsonPath}: ${error.message}`);
    }
  }

  loadFromObject(data) {
    if (Array.isArray(data)) {
      return this.loadFromArray(data);
    } else if (typeof data === 'object' && data !== null) {
      const cookieString = Object.entries(data)
        .map(([name, value]) => `${name}=${value}`)
        .join('; ');
      return this.loadFromString(cookieString);
    }

    throw new Error('Invalid object format');
  }

  loadFromArray(cookieArray) {
    if (!Array.isArray(cookieArray)) {
      throw new Error('Expected array of cookies');
    }

    const cookieString = cookieArray
      .map(cookie => {
        if (typeof cookie === 'string') {
          return cookie;
        }

        if (typeof cookie === 'object' && cookie !== null) {
          const name = cookie.name || cookie.Name || cookie.key;
          const value = cookie.value || cookie.Value || cookie.val;

          if (name && value !== undefined) {
            return `${name}=${value}`;
          }
        }

        return null;
      })
      .filter(c => c !== null)
      .join('; ');

    return this.loadFromString(cookieString);
  }

  loadFromNetscapeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return this.parseNetscapeFormat(content);
    } catch (error) {
      throw new Error(`Failed to load Netscape cookies from ${filePath}: ${error.message}`);
    }
  }

  parseNetscapeFormat(content) {
    const lines = content.split('\n');
    const cookies = [];

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const parts = trimmed.split('\t');

      if (parts.length >= 7) {
        const name = parts[5];
        const value = parts[6];
        cookies.push({ name, value });
      } else if (parts.length >= 2) {
        const [name, value] = parts;
        cookies.push({ name, value });
      }
    }

    return this.loadFromArray(cookies);
  }

  parseCookies(cookieString) {
    this.cookies = {};

    if (!cookieString || typeof cookieString !== 'string') {
      return this;
    }

    const pairs = cookieString.split(';');

    for (const pair of pairs) {
      const trimmed = pair.trim();
      if (!trimmed) continue;

      const equalIndex = trimmed.indexOf('=');
      if (equalIndex === -1) continue;

      const name = trimmed.substring(0, equalIndex).trim();
      const value = trimmed.substring(equalIndex + 1).trim();

      if (name) {
        this.cookies[name] = value;
      }
    }

    return this;
  }

  getCookieString() {
    if (this.cookieString) {
      return this.cookieString;
    }

    return Object.entries(this.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }

  getCookie(name) {
    return this.cookies[name];
  }

  setCookie(name, value) {
    this.cookies[name] = value;
    this.cookieString = '';
    return this;
  }

  hasCookies() {
    return Object.keys(this.cookies).length > 0;
  }

  clear() {
    this.cookies = {};
    this.cookieString = '';
    return this;
  }

  toJSON() {
    return this.cookies;
  }
}

function loadCookiesFromBrowser(browserName = 'chrome') {
  throw new Error(
    'Browser cookie extraction is not supported in this version. ' +
    'Please export cookies manually using a browser extension like "Get cookies.txt" ' +
    'or "EditThisCookie" and load them using cookieManager.loadFromFile().'
  );
}

module.exports = {
  CookieManager,
  loadCookiesFromBrowser
};
