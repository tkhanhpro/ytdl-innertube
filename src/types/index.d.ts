/// <reference types="node" />

import { Readable } from 'stream';

export interface InnerTubeClient {
  clientName: string;
  clientVersion: string;
  androidSdkVersion?: number;
  deviceMake?: string;
  deviceModel?: string;
  osName?: string;
  osVersion?: string;
  hl: string;
  gl: string;
  userAgent: string;
  priority: number;
}

export interface VideoFormat {
  itag: number;
  mimeType: string;
  bitrate: number;
  audioBitrate?: number;
  width?: number;
  height?: number;
  contentLength?: string;
  quality: string;
  qualityLabel?: string;
  fps?: number;
  url: string;
  hasVideo: boolean;
  hasAudio: boolean;
  container: string;
  codecs?: string;
  videoCodec?: string;
  audioCodec?: string;
  _innerTubeClient?: string;
}

export interface VideoDetails {
  videoId: string;
  title: string;
  lengthSeconds: string;
  channelId: string;
  isOwnerViewing: boolean;
  shortDescription: string;
  isCrawlable: boolean;
  thumbnail: {
    thumbnails: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  allowRatings: boolean;
  viewCount: string;
  author: string;
  isPrivate: boolean;
  isUnpluggedCorpus: boolean;
  isLiveContent: boolean;
}

export interface VideoInfo {
  success: boolean;
  videoDetails: VideoDetails;
  formats: VideoFormat[];
  html5player: string | null;
  _innerTube: {
    client: string;
    directUrls: number;
    needsCipher: number;
    attempts: number;
  };
  full: boolean;
}

export interface DownloadOptions {
  quality?: 'highest' | 'lowest' | 'highestaudio' | 'lowestaudio' | 'highestvideo' | 'lowestvideo' | number;
  filter?: 'audioonly' | 'videoonly' | 'audioandvideo' | ((format: VideoFormat) => boolean);
  format?: VideoFormat;
  range?: {
    start: number;
    end: number;
  };
  begin?: number | string;
  highWaterMark?: number;
  dlChunkSize?: number;
  requestOptions?: object;
  innerTubeClients?: string[];
}

export interface InfoOptions {
  innerTubeClients?: string[];
  requestOptions?: object;
}

declare function ytdl(url: string, options?: DownloadOptions): Readable;

declare namespace ytdl {
  function getInfo(url: string, options?: InfoOptions): Promise<VideoInfo>;

  function chooseFormat(formats: VideoFormat[], options?: DownloadOptions): VideoFormat;

  function filterFormats(formats: VideoFormat[], filter: string | ((format: VideoFormat) => boolean)): VideoFormat[];

  function validateID(id: string): boolean;

  function validateURL(url: string): boolean;

  function getURLVideoID(url: string): string;

  function getVideoID(url: string): Promise<string>;

  function downloadFromInfo(info: VideoInfo, options?: DownloadOptions): Readable;

  const INNERTUBE_CLIENTS: Record<string, InnerTubeClient>;

  const version: string;
}

export = ytdl;
