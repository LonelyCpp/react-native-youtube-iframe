import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {WebViewProps} from 'react-native-webview';

export enum PLAYER_STATES {
  ENDED = 'ended',
  PAUSED = 'paused',
  PLAYING = 'playing',
  UNSTARTED = 'unstarted',
  BUFFERING = 'buffering',
  VIDEO_CUED = 'video cued',
}

export enum PLAYER_ERRORS {
  HTML5_ERROR = 'HTML5_error',
  VIDEO_NOT_FOUND = 'video_not_found',
  EMBED_NOT_ALLOWED = 'embed_not_allowed',
  INVALID_PARAMETER = 'invalid_parameter',
}

export interface YoutubeIframeRef {
  getDuration: () => Promise<number>;
  getVideoUrl: () => Promise<string>;
  getCurrentTime: () => Promise<number>;
  isMuted: () => Promise<boolean>;
  getVolume: () => Promise<number>;
  getPlaybackRate: () => Promise<number>;
  getAvailablePlaybackRates: () => Promise<number[]>;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
}

export interface InitialPlayerParams {
  loop?: boolean;
  controls?: boolean;
  cc_lang_pref?: string;
  showClosedCaptions?: boolean;
  color?: string;
  start?: Number;
  end?: Number;
  preventFullScreen?: boolean;
  playerLang?: String;
  iv_load_policy?: Number;
  modestbranding?: boolean;
  rel?: boolean;
}

export interface YoutubeIframeProps {
  /**
   * height of the webview container
   *
   * Note: Embedded players must have a viewport that is at least 200px by 200px. If the player displays controls, it must be large enough to fully display the controls without shrinking the viewport below the minimum size. We recommend 16:9 players be at least 480 pixels wide and 270 pixels tall.
   */
  height: number;
  /**
   * width of the webview container
   *
   * Note: Embedded players must have a viewport that is at least 200px by 200px. If the player displays controls, it must be large enough to fully display the controls without shrinking the viewport below the minimum size. We recommend 16:9 players be at least 480 pixels wide and 270 pixels tall.
   */
  width?: number;
  /**
   * Specifies the YouTube Video ID of the video to be played.
   */
  videoId?: string;
  /**
   * Specifies the playlist to play. It can be either the playlist ID or a list of video IDs
   *
   * @example
   * playList={'PLbpi6ZahtOH6Blw3RGYpWkSByi_T7Rygb'}
   *
   * @example
   * playList={['QRt7LjqJ45k', 'fHsa9DqmId8']}
   */
  playList?: Array<string> | string;
  /**
   * Flag to tell the player to play or pause the video.
   */
  play?: boolean;

  /**
   * Flag to tell the player to mute the video.
   */
  mute?: boolean;
  /**
   * Sets the volume. Accepts an integer between `0` and `100`.
   */
  volume?: number;
  /**
   * A style prop that will be given to the webview
   */
  webViewStyle?: StyleProp<ViewStyle>;
  /**
   * Props that are supplied to the underlying webview (react-native-webview). A full list of props can be found [here](https://github.com/react-native-community/react-native-webview/blob/master/docs/Reference.md#props-index)
   */
  webViewProps?: WebViewProps;
  /**
   * This sets the suggested playback rate for the current video. If the playback rate changes, it will only change for the video that is already cued or being played.
   */
  playbackRate?: number;
  /**
   * This event fires if an error occurs in the player. The API will pass an error string to the event listener function.
   */
  onError?: (error: string) => void;
  /**
   * This event fires whenever a player has finished loading and is ready.
   */
  onReady?: () => void;
  /**
   * Starts the playlist from the given index
   *
   * Works only if the playlist is a list of video IDs.
   */
  playListStartIndex?: number;
  initialPlayerParams?: InitialPlayerParams;
  /**
   * Changes user string to make autoplay work on the iframe player for some android devices.
   */
  forceAndroidAutoplay?: boolean;
  /**
   * callback for when the player's state changes.
   */
  onChangeState?: (event: PLAYER_STATES) => void;
  /**
   * callback for when the fullscreen option is clicked in the player. It signals the new fullscreen state of the player.
   */
  onFullScreenChange?: (status: boolean) => void;
  /**
   * callback for when the video playback quality changes. It might signal a change in the viewer's playback environment.
   */
  onPlaybackQualityChange?: (quality: string) => void;
  /**
   * callback for when the video playback rate changes.
   */
  onPlaybackRateChange?: (event: string) => void;
  /**
   * Flag to decide whether or not a user can zoom the video webview.
   */
  allowWebViewZoom?: boolean;
  /**
   * Set this React Ref to use ref functions such as getDuration.
   */
  ref?: React.MutableRefObject<YoutubeIframeRef | null>;
  /**
   * scale factor for initial-scale and maximum-scale in
   * <meta /> tag on the webpage
   */
  contentScale?: number;
  /**
   * force use locally generated HTML string. defaults to `false`
   */
  useLocalHTML?: boolean;
  /**
   * url that fetches a webpage compatible with youtube iframe interface
   *
   * * defaults to : https://lonelycpp.github.io/react-native-youtube-iframe/iframe.html
   * * for code check "iframe.html" in package repo
   */
  baseUrlOverride?: string;
}

export interface YoutubeMeta {
  thumbnail_width: number;
  type: string;
  html: string;
  height: number;
  author_name: string;
  width: number;
  title: string;
  author_url: string;
  version: string;
  thumbnail_height: number;
  provider_url: string;
  thumbnail_url: string;
}

declare const YoutubeIframe: React.VFC<YoutubeIframeProps>;

export default YoutubeIframe;

export function getYoutubeMeta(id: string): Promise<YoutubeMeta>;
