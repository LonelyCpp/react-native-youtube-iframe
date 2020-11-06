import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import WebView from 'react-native-webview';
import {PLAYER_STATES, PLAYER_ERROR, CUSTOM_USER_AGENT} from './constants';
import {EventEmitter} from 'events';
import {
  playMode,
  soundMode,
  MAIN_SCRIPT,
  PLAYER_FUNCTIONS,
} from './PlayerScripts';

const YoutubeIframe = (props, ref) => {
  const {
    height,
    width,
    videoId,
    playList,
    play = false,
    mute = false,
    volume = 100,
    webViewStyle,
    webViewProps,
    playbackRate = 1,
    contentScale = 1.0,
    onError = _err => {},
    onReady = _event => {},
    playListStartIndex = 0,
    initialPlayerParams = {},
    allowWebViewZoom = false,
    forceAndroidAutoplay = false,
    onChangeState = _event => {},
    onFullScreenChange = _status => {},
    onPlaybackQualityChange = _quality => {},
    onPlaybackRateChange = _playbackRate => {},
  } = props;

  const webViewRef = useRef(null);
  const eventEmitter = useRef(new EventEmitter());
  const [playerReady, setPlayerReady] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      getDuration: () => {
        webViewRef.current.injectJavaScript(PLAYER_FUNCTIONS.durationScript);
        return new Promise(resolve => {
          eventEmitter.current.once('getDuration', resolve);
        });
      },
      getCurrentTime: () => {
        webViewRef.current.injectJavaScript(PLAYER_FUNCTIONS.currentTimeScript);
        return new Promise(resolve => {
          eventEmitter.current.once('getCurrentTime', resolve);
        });
      },
      isMuted: () => {
        webViewRef.current.injectJavaScript(PLAYER_FUNCTIONS.isMutedScript);
        return new Promise(resolve => {
          eventEmitter.current.once('isMuted', resolve);
        });
      },
      getVolume: () => {
        webViewRef.current.injectJavaScript(PLAYER_FUNCTIONS.getVolumeScript);
        return new Promise(resolve => {
          eventEmitter.current.once('getVolume', resolve);
        });
      },
      getPlaybackRate: () => {
        webViewRef.current.injectJavaScript(
          PLAYER_FUNCTIONS.getPlaybackRateScript,
        );
        return new Promise(resolve => {
          eventEmitter.current.once('getPlaybackRate', resolve);
        });
      },
      getAvailablePlaybackRates: () => {
        webViewRef.current.injectJavaScript(
          PLAYER_FUNCTIONS.getAvailablePlaybackRatesScript,
        );
        return new Promise(resolve => {
          eventEmitter.current.once('getAvailablePlaybackRates', resolve);
        });
      },
      seekTo: (seconds, allowSeekAhead) => {
        webViewRef.current.injectJavaScript(
          PLAYER_FUNCTIONS.seekToScript(seconds, allowSeekAhead),
        );
      },
    }),
    [],
  );

  useEffect(() => {
    if (!playerReady) {
      return;
    }

    [
      playMode[play],
      soundMode[mute],
      PLAYER_FUNCTIONS.setVolume(volume),
      PLAYER_FUNCTIONS.setPlaybackRate(playbackRate),
    ].forEach(webViewRef.current.injectJavaScript);
  }, [play, playerReady, mute, volume, playbackRate]);

  const onWebMessage = useCallback(
    event => {
      const message = JSON.parse(event.nativeEvent.data);
      try {
        switch (message.eventType) {
          case 'fullScreenChange':
            onFullScreenChange(message.data);
            break;
          case 'playerStateChange':
            onChangeState(PLAYER_STATES[message.data]);
            break;
          case 'playerReady':
            onReady();
            setPlayerReady(true);
            if (Array.isArray(playList)) {
              webViewRef.current.injectJavaScript(
                PLAYER_FUNCTIONS.loadPlaylist(
                  playList,
                  playListStartIndex,
                  play,
                ),
              );
            }
            break;
          case 'playerQualityChange':
            onPlaybackQualityChange(message.data);
            break;
          case 'playerError':
            onError(PLAYER_ERROR[message.data]);
            break;
          case 'playbackRateChange':
            onPlaybackRateChange(message.data);
            break;
          default:
            eventEmitter.current.emit(message.eventType, message.data);
            break;
        }
      } catch (error) {
        console.warn(error);
      }
    },
    [
      play,
      onReady,
      onError,
      playList,
      onChangeState,
      onFullScreenChange,
      playListStartIndex,
      onPlaybackRateChange,
      onPlaybackQualityChange,
    ],
  );

  return (
    <View style={{height, width}}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        onMessage={onWebMessage}
        allowsInlineMediaPlayback
        style={[styles.webView, webViewStyle]}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={!initialPlayerParams?.preventFullScreen}
        source={{
          html: MAIN_SCRIPT(
            videoId,
            playList,
            initialPlayerParams,
            allowWebViewZoom,
            contentScale,
          ),
        }}
        userAgent={
          forceAndroidAutoplay
            ? Platform.select({android: CUSTOM_USER_AGENT, ios: ''})
            : ''
        }
        onShouldStartLoadWithRequest={request => {
          return request.mainDocumentURL === 'about:blank';
        }}
        bounces={false}
        {...webViewProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  webView: {backgroundColor: 'transparent'},
});

export default forwardRef(YoutubeIframe);
