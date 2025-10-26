const { PassThrough } = require('stream');
const { request } = require('undici');

function createStream(options = {}) {
  const stream = new PassThrough({ highWaterMark: options.highWaterMark || 1024 * 512 });
  stream._destroy = () => {
    stream.destroyed = true;
  };
  return stream;
}

async function fetchStream(url, options = {}) {
  const headers = {};

  if (options.range) {
    headers['Range'] = `bytes=${options.range.start}-${options.range.end || ''}`;
  }

  if (options.requestOptions?.headers) {
    Object.assign(headers, options.requestOptions.headers);
  }

  // Sử dụng interceptor để xử lý redirect thay vì maxRedirections
  const response = await request(url, {
    method: 'GET',
    headers,
    interceptors: {
      redirect: async (request, follow) => {
        // Giới hạn số lần redirect (tương đương maxRedirections: 5)
        let redirectCount = 0;
        const maxRedirects = 5;

        while (redirectCount < maxRedirects) {
          const redirectResponse = await follow();
          if (redirectResponse.statusCode >= 300 && redirectResponse.statusCode < 400 && redirectResponse.headers.location) {
            redirectCount++;
            // Tiếp tục theo URL redirect mới
            request.url = new URL(redirectResponse.headers.location, request.url).toString();
            continue;
          }
          return redirectResponse;
        }

        throw new Error('Maximum number of redirects exceeded');
      }
    }
  });

  return response.body;
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

  setImmediate(async () => {
    try {
      const downloadOptions = {
        highWaterMark: options.highWaterMark || 1024 * 512,
        requestOptions: options.requestOptions || {},
        range: options.range
      };

      const contentLength = format.contentLength;
      const shouldBeChunked = contentLength && options.dlChunkSize && (!options.range || !options.range.start);

      if (shouldBeChunked) {
        let start = options.range?.start || 0;
        let end = start + options.dlChunkSize;
        const rangeEnd = options.range?.end;

        const downloadChunk = async () => {
          if (rangeEnd && end >= rangeEnd) end = rangeEnd;
          if (end >= contentLength) end = 0;

          const shouldContinue = end && end !== rangeEnd;

          const bodyStream = await fetchStream(format.url, {
            ...downloadOptions,
            range: { start, end }
          });

          bodyStream.on('data', chunk => {
            start += chunk.length;
            stream.write(chunk);
          });

          bodyStream.on('end', () => {
            if (stream.destroyed) return;
            if (shouldContinue) {
              end = start + options.dlChunkSize;
              downloadChunk();
            } else {
              stream.end();
            }
          });

          bodyStream.on('error', err => stream.emit('error', err));
        };

        await downloadChunk();
      } else {
        const bodyStream = await fetchStream(format.url, downloadOptions);

        bodyStream.on('data', chunk => stream.write(chunk));
        bodyStream.on('end', () => stream.end());
        bodyStream.on('error', err => stream.emit('error', err));
      }
    } catch (error) {
      stream.emit('error', error);
    }
  });

  return stream;
}

module.exports = {
  createStream,
  downloadFromInfo
};
