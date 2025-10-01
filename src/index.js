const { getInfo } = require('./info');
const { chooseFormat, filterFormats } = require('./formats');
const { validateID, validateURL, getURLVideoID, getVideoID } = require('./utils/url');
const { downloadFromInfo, createStream } = require('./download');
const { CLIENTS } = require('./core/innertube');
const { CookieManager } = require('./core/cookies');

function ytdl(link, options = {}) {
  const stream = createStream(options);

  ytdl.getInfo(link, options)
    .then(info => {
      const format = chooseFormat(info.formats, options);
      const downloadStream = downloadFromInfo(info, format, options);

      downloadStream.on('error', err => stream.emit('error', err));
      downloadStream.on('info', (info, format) => stream.emit('info', info, format));
      downloadStream.pipe(stream);
    })
    .catch(err => stream.emit('error', err));

  return stream;
}

ytdl.getInfo = async (link, options = {}) => {
  const id = await getVideoID(link);
  return getInfo(id, options);
};

ytdl.chooseFormat = chooseFormat;
ytdl.filterFormats = filterFormats;
ytdl.validateID = validateID;
ytdl.validateURL = validateURL;
ytdl.getURLVideoID = getURLVideoID;
ytdl.getVideoID = getVideoID;
ytdl.downloadFromInfo = (info, options = {}) => {
  const format = chooseFormat(info.formats, options);
  return downloadFromInfo(info, format, options);
};
ytdl.INNERTUBE_CLIENTS = CLIENTS;
ytdl.CookieManager = CookieManager;
ytdl.createCookieManager = () => new CookieManager();
ytdl.version = require('../package.json').version;

module.exports = ytdl;
