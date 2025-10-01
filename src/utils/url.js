const validQueryDomains = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'gaming.youtube.com',
]);

const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;

function validateID(id) {
  return /^[a-zA-Z0-9-_]{11}$/.test(id);
}

function validateURL(url) {
  try {
    const parsed = new URL(url);
    let id = parsed.searchParams.get('v');

    if (validPathDomains.test(url) && !id) {
      const paths = parsed.pathname.split('/');
      id = paths[paths.length - 1];
    } else if (parsed.hostname && !validQueryDomains.has(parsed.hostname)) {
      return false;
    }

    return !!(id && validateID(id));
  } catch (e) {
    return false;
  }
}

function getURLVideoID(url) {
  try {
    const parsed = new URL(url);
    let id = parsed.searchParams.get('v');

    if (validPathDomains.test(url) && !id) {
      const paths = parsed.pathname.split('/');
      id = paths[paths.length - 1];
    }

    if (id && validateID(id)) {
      return id;
    }
  } catch (e) {
    // URL parsing failed
  }

  throw new Error('No video id found: ' + url);
}

async function getVideoID(url) {
  if (validateID(url)) {
    return url;
  }

  return getURLVideoID(url);
}

module.exports = {
  validateID,
  validateURL,
  getURLVideoID,
  getVideoID
};
