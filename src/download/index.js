const { PassThrough } = require('stream');
const miniget = require('miniget');

function createStream(options = {}) {
  const stream = new PassThrough({ highWaterMark: options.highWaterMark || 1024 * 512 });
  stream._destroy = () => {
    stream.destroyed = true;
  };
  return stream;
}

function pipeAndSetEvents(req, stream, end) {
  ['abort', 'request', 'response', 'error', 'redirect', 'retry', 'reconnect'].forEach(event => {
    req.prependListener(event, stream.emit.bind(stream, event));
  });
  req.pipe(stream, { end });
}

function downloadFromInfo(info, format, options = {}) {
  const stream = createStream(options);

  if (!info.formats || !info.formats.length) {
    stream.emit('error', new Error('This video is unavailable or has no formats'));
    return stream;
  }

  stream.emit('info', info, format);

  if (stream.destroyed) {
    return stream;
  }

  const downloadOptions = {
    highWaterMark: options.highWaterMark || 1024 * 512,
    requestOptions: options.requestOptions || {}
  };

  if (options.begin) {
    downloadOptions.begin = options.begin;
  }

  const contentLength = format.contentLength;
  const shouldBeChunked = contentLength && options.dlChunkSize && (!options.range || !options.range.start);

  if (shouldBeChunked) {
    let start = options.range?.start || 0;
    let end = start + options.dlChunkSize;
    const rangeEnd = options.range?.end;

    const downloadChunk = () => {
      if (rangeEnd && end >= rangeEnd) end = rangeEnd;
      if (end >= contentLength) end = 0;

      const shouldContinue = end && end !== rangeEnd;
      downloadOptions.range = { start, end };

      const req = miniget(format.url, downloadOptions);
      req.on('data', chunk => {
        start += chunk.length;
      });
      req.on('end', () => {
        if (stream.destroyed) return;
        if (shouldContinue) {
          end = start + options.dlChunkSize;
          downloadChunk();
        }
      });

      pipeAndSetEvents(req, stream, !shouldContinue);
    };

    downloadChunk();
  } else {
    if (options.range) {
      downloadOptions.range = options.range;
    }

    const req = miniget(format.url, downloadOptions);
    pipeAndSetEvents(req, stream, true);
  }

  return stream;
}

module.exports = {
  createStream,
  downloadFromInfo
};
