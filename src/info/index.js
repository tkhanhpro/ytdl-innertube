const { getVideoInfoMultiClient } = require('../core/innertube');

async function getInfo(videoId, options = {}) {
  try {
    const result = await getVideoInfoMultiClient(videoId, options);

    if (!result.success) {
      throw new Error('Failed to get video info');
    }

    return {
      success: true,
      videoDetails: result.videoDetails,
      formats: result.formats.map(format => ({
        ...format,
        hasVideo: format.mimeType ? format.mimeType.includes('video') : false,
        hasAudio: format.mimeType ? format.mimeType.includes('audio') : false,
        container: format.mimeType ? format.mimeType.split(';')[0].split('/')[1] : 'unknown',
        _innerTubeClient: result.client
      })),
      html5player: null,
      _innerTube: {
        client: result.client,
        directUrls: result.directUrls,
        needsCipher: result.needsCipher,
        attempts: result.attempts
      },
      full: true
    };

  } catch (error) {
    error.videoId = videoId;
    throw error;
  }
}

module.exports = {
  getInfo
};
