function sortFormats(a, b) {
  const aHasVideo = a.hasVideo;
  const bHasVideo = b.hasVideo;
  const aHasAudio = a.hasAudio;
  const bHasAudio = b.hasAudio;

  const aVideoQuality = a.qualityLabel ? parseInt(a.qualityLabel) : 0;
  const bVideoQuality = b.qualityLabel ? parseInt(b.qualityLabel) : 0;

  if (aHasVideo && bHasVideo) {
    const aCombined = aHasAudio && aHasVideo;
    const bCombined = bHasAudio && bHasVideo;

    if (aCombined && !bCombined) return -1;
    if (!aCombined && bCombined) return 1;

    if (bVideoQuality < aVideoQuality) return -1;
    if (bVideoQuality > aVideoQuality) return 1;
  }

  const aBitrate = a.bitrate || 0;
  const bBitrate = b.bitrate || 0;
  if (aBitrate > bBitrate) return -1;
  if (aBitrate < bBitrate) return 1;

  return 0;
}

function filterFormats(formats, filter) {
  if (typeof filter === 'function') {
    return formats.filter(filter);
  }

  switch (filter) {
    case 'audioonly':
      return formats.filter(f => f.hasAudio && !f.hasVideo);
    case 'videoonly':
      return formats.filter(f => f.hasVideo && !f.hasAudio);
    case 'audioandvideo':
    case 'videoandaudio':
      return formats.filter(f => f.hasVideo && f.hasAudio);
    default:
      return formats;
  }
}

function chooseFormat(formats, options = {}) {
  if (options.format) {
    return options.format;
  }

  let filter = options.filter || 'audioandvideo';
  let quality = options.quality || 'highest';

  let filteredFormats = filterFormats(formats, filter);

  if (!filteredFormats.length) {
    filteredFormats = filterFormats(formats, 'audioandvideo');
  }

  if (!filteredFormats.length) {
    filteredFormats = formats;
  }

  if (typeof quality === 'number') {
    const format = filteredFormats.find(f => f.itag === quality);
    if (!format) {
      throw new Error(`No format found with itag: ${quality}`);
    }
    return format;
  }

  const sortedFormats = filteredFormats.sort(sortFormats);

  switch (quality) {
    case 'highest':
      return sortedFormats[0];
    case 'lowest':
      return sortedFormats[sortedFormats.length - 1];
    case 'highestaudio':
      filter = 'audioonly';
      filteredFormats = filterFormats(formats, filter).sort((a, b) => {
        return (b.audioBitrate || b.bitrate || 0) - (a.audioBitrate || a.bitrate || 0);
      });
      return filteredFormats[0];
    case 'lowestaudio':
      filter = 'audioonly';
      filteredFormats = filterFormats(formats, filter).sort((a, b) => {
        return (a.audioBitrate || a.bitrate || 0) - (b.audioBitrate || b.bitrate || 0);
      });
      return filteredFormats[0];
    case 'highestvideo':
      filter = 'videoonly';
      filteredFormats = filterFormats(formats, filter).sort((a, b) => {
        const aQuality = parseInt(a.qualityLabel) || 0;
        const bQuality = parseInt(b.qualityLabel) || 0;
        return bQuality - aQuality;
      });
      return filteredFormats[0];
    case 'lowestvideo':
      filter = 'videoonly';
      filteredFormats = filterFormats(formats, filter).sort((a, b) => {
        const aQuality = parseInt(a.qualityLabel) || 0;
        const bQuality = parseInt(b.qualityLabel) || 0;
        return aQuality - bQuality;
      });
      return filteredFormats[0];
    default:
      return sortedFormats[0];
  }
}

module.exports = {
  sortFormats,
  filterFormats,
  chooseFormat
};
