import React from 'react';
import {WebViewProps} from 'react-native-webview';

export interface InitialPlayerParams {
  loop: boolean;
  controls: boolean;
  cc_lang_pref: string;
  showClosedCaptions: boolean;
  color: string;
  start: Number;
  end: Number;
  preventFullScreen: boolean;
  playerLang: String;
  iv_load_policy: Number;
  modestbranding: boolean;
  rel: boolean;
}

export interface YoutubeIframeProps {
  /**
   * height of the webview container
   *
   * Note: Embedded players must have a viewport that is at least 200px by 200px. If the player displays controls, it must be large enough to fully display the controls without shrinking the viewport below the minimum size. We recommend 16:9 players be at least 480 pixels wide and 270 pixels tall.
   */
  height: Number;
  /**
   * width of the webview container
   *
   * Note: Embedded players must have a viewport that is at least 200px by 200px. If the player displays controls, it must be large enough to fully display the controls without shrinking the viewport below the minimum size. We recommend 16:9 players be at least 480 pixels wide and 270 pixels tall.
   */
  width?: Number;
  /**
   * Specifies the YouTube Video ID of the video to be played.
   */
  videoId: String;
  /**
   * Specifies the playlist to play. It can be either the playlist ID or a list of video IDs
   *
   * @example
   * playList={'PLbpi6ZahtOH6Blw3RGYpWkSByi_T7Rygb'}
   *
   * @example
   * playList={['QRt7LjqJ45k', 'fHsa9DqmId8']}
   */
  playList: Array<String> | String;
  /**
   * Flag to tell the player to play or pause the video.
   */
  play: Boolean;

  /**
   * Flag to tell the player to mute the video.
   */
  mute: Boolean;
  /**
   * Sets the volume. Accepts an integer between `0` and `100`.
   */
  volume: Number;
  /**
   * A style prop that will be given to the webview
   */
  webViewStyle: any;
  /**
   * Props that are supplied to the underlying webview (react-native-webview). A full list of props can be found [here](https://github.com/react-native-community/react-native-webview/blob/master/docs/Reference.md#props-index)
   */
  webViewProps: WebViewProps;
  /**
   * This sets the suggested playback rate for the current video. If the playback rate changes, it will only change for the video that is already cued or being played.
   */
  playbackRate: Number;
  /**
   * This event fires if an error occurs in the player. The API will pass an error string to the event listener function.
   */
  onError: (error: string) => void;
  /**
   * This event fires whenever a player has finished loading and is ready.
   */
  onReady: () => void;
  /**
   * Starts the playlist from the given index
   *
   * Works only if the playlist is a list of video IDs.
   */
  playListStartIndex: Number;
  initialPlayerParams: InitialPlayerParams;
  /**
   * Changes user string to make autoplay work on the iframe player for some android devices.
   */
  forceAndroidAutoplay: Boolean;
  /**
   * callback for when the player's state changes.
   */
  onChangeState: (event: String) => void;
  /**
   * callback for when the video playback quality changes. It might signal a change in the viewer's playback environment.
   */
  onPlaybackQualityChange: (quality: String) => void;
  /**
   * callback for when the video playback rate changes.
   */
  onPlaybackRateChange: (event: String) => void;
}

declare const YoutubeIframe: React.SFC<YoutubeIframeProps>;

export default YoutubeIframe;
