import React, {
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import {View, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import {PLAYER_STATES, PLAYER_ERROR} from './constants';
import {EventEmitter} from 'events';
import {MAIN_SCRIPT, PLAYER_FUNCTIONS} from './PlayerScripts';

const YoutubeIframe = (
  {
    height,
    width,
    videoId,
    playList,
    playListStartIndex = 0,
    play = false,
    onChangeState = _event => {},
    onReady = _event => {},
    onError = _err => {},
    onPlaybackQualityChange = _quality => {},
    mute = false,
    volume = 100,
    playbackRate = 1,
    onPlaybackRateChange = _playbackRate => {},
    initialPlayerParams = {},
    webViewStyle,
    webViewProps,
  },
  ref,
) => {
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
    if (playerReady) {
      if (play) {
        webViewRef.current.injectJavaScript(PLAYER_FUNCTIONS.playVideo);
      } else {
        webViewRef.current.injectJavaScript(PLAYER_FUNCTIONS.pauseVideo);
      }

      if (mute) {
        webViewRef.current.injectJavaScript(PLAYER_FUNCTIONS.muteVideo);
      } else {
        webViewRef.current.injectJavaScript(PLAYER_FUNCTIONS.unMuteVideo);
      }
      webViewRef.current.injectJavaScript(PLAYER_FUNCTIONS.setVolume(volume));
      webViewRef.current.injectJavaScript(
        PLAYER_FUNCTIONS.setPlaybackRate(playbackRate),
      );
    }
  }, [play, playerReady, mute, volume, playbackRate]);

  const onWebMessage = useCallback(
    event => {
      const message = JSON.parse(event.nativeEvent.data);
      try {
        switch (message.eventType) {
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
      onChangeState,
      onReady,
      onPlaybackQualityChange,
      onError,
      onPlaybackRateChange,
      playListStartIndex,
      playList,
      play,
    ],
  );

  return (
    <View style={{height, width}}>
      <WebView
        style={[styles.webView, webViewStyle]}
        ref={webViewRef}
        originWhitelist={['*']}
        source={{html: MAIN_SCRIPT(videoId, playList, initialPlayerParams)}}
        allowsInlineMediaPlayback
        onMessage={onWebMessage}
        {...webViewProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  webView: {backgroundColor: 'transparent'},
});

export default forwardRef(YoutubeIframe);
