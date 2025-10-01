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

      if (Array.isArray(data)) {
        const cookieString = data
          .map(cookie => `${cookie.name}=${cookie.value}`)
          .join('; ');
        return this.loadFromString(cookieString);
      } else if (typeof data === 'object') {
        const cookieString = Object.entries(data)
          .map(([name, value]) => `${name}=${value}`)
          .join('; ');
        return this.loadFromString(cookieString);
      }

      throw new Error('Invalid JSON format');
    } catch (error) {
      throw new Error(`Failed to load cookies from JSON ${jsonPath}: ${error.message}`);
    }
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
