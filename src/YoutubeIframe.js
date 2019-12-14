import React, {
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useState
} from "react";
import { View } from "react-native";
import WebView from "react-native-webview";
import { PLAYER_STATES, PLAYER_ERROR } from "./constants";
import { EventEmitter } from "events";

const YoutubeIframe = (
  {
    height,
    width,
    videoId,
    play = false,
    onChangeState,
    onReady,
    onError,
    onPlaybackQualityChange,
    mute = false,
    volume = 100,
    playbackRate = 1,
    onPlaybackRateChange,
    initialPlayerParams = {}
  },
  ref
) => {
  const webViewRef = useRef(null);
  const eventEmitter = useRef(new EventEmitter());
  const [playerReady, setPlayerReady] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      getDuration: () => {
        webViewRef.current.injectJavaScript(durationScript);
        return new Promise(resolve => {
          eventEmitter.current.once("getDuration", resolve);
        });
      },
      getCurrentTime: () => {
        webViewRef.current.injectJavaScript(currentTimeScript);
        return new Promise(resolve => {
          eventEmitter.current.once("getCurrentTime", resolve);
        });
      },
      isMuted: () => {
        webViewRef.current.injectJavaScript(isMutedScript);
        return new Promise(resolve => {
          eventEmitter.current.once("isMuted", resolve);
        });
      },
      getVolume: () => {
        webViewRef.current.injectJavaScript(getVolumeScript);
        return new Promise(resolve => {
          eventEmitter.current.once("getVolume", resolve);
        });
      },
      getPlaybackRate: () => {
        webViewRef.current.injectJavaScript(getPlaybackRateScript);
        return new Promise(resolve => {
          eventEmitter.current.once("getPlaybackRate", resolve);
        });
      },
      getAvailablePlaybackRates: () => {
        webViewRef.current.injectJavaScript(getAvailablePlaybackRatesScript);
        return new Promise(resolve => {
          eventEmitter.current.once("getAvailablePlaybackRates", resolve);
        });
      },
      seekTo: (seconds, allowSeekAhead) => {
        webViewRef.current.injectJavaScript(
          seekToScript(seconds, allowSeekAhead)
        );
        return new Promise(resolve => {
          eventEmitter.current.once("getAvailablePlaybackRates", resolve);
        });
      }
    }),
    []
  );

  useEffect(() => {
    if (playerReady) {
      if (play) {
        webViewRef.current.injectJavaScript("player.playVideo(); true;");
      } else {
        webViewRef.current.injectJavaScript("player.pauseVideo(); true;");
      }

      if (mute) {
        webViewRef.current.injectJavaScript("player.mute(); true;");
      } else {
        webViewRef.current.injectJavaScript("player.unMute(); true;");
      }
      webViewRef.current.injectJavaScript(`player.setVolume(${volume}); true;`);
      webViewRef.current.injectJavaScript(
        `player.setPlaybackRate(${playbackRate}); true;`
      );
    }
  }, [play, playerReady, mute, volume, playbackRate]);

  const onWebMessage = useCallback(
    event => {
      const message = JSON.parse(event.nativeEvent.data);
      // console.log({message});
      try {
        switch (message.eventType) {
          case "playerStateChange":
            onChangeState(PLAYER_STATES[message.data]);
            break;
          case "playerReady":
            onReady();
            setPlayerReady(true);
            break;
          case "playerQualityChange":
            onPlaybackQualityChange(message.data);
            break;
          case "playerError":
            onError(PLAYER_ERROR[message.data]);
            break;
          case "playbackRateChange":
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
      onPlaybackRateChange
    ]
  );

  return (
    <View style={{ height, width }}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: script(videoId, initialPlayerParams) }}
        allowsInlineMediaPlayback
        onMessage={onWebMessage}
      />
    </View>
  );
};

const durationScript = `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getDuration', data: player.getDuration()}));
true;
`;

const currentTimeScript = `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getCurrentTime', data: player.getCurrentTime()}));
true;
`;

const isMutedScript = `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'isMuted', data: player.isMuted()}));
true;
`;

const getVolumeScript = `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getVolume', data: player.getVolume()}));
true;
`;

const getPlaybackRateScript = `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getPlaybackRate', data: player.getPlaybackRate()}));
true;
`;

const getAvailablePlaybackRatesScript = `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getAvailablePlaybackRates', data: player.getAvailablePlaybackRates()}));
true;
`;

const seekToScript = (seconds, allowSeekAhead) => `
player.seekTo(${seconds}, ${allowSeekAhead})
`;

const script = (
  videoId,
  {
    loop = false,
    controls = true,
    cc_lang_pref, // country code
    showClosedCaptions,
    color, // 'red' or 'white'
    end,
    preventFullScreen = false,
    playerLang,
    iv_load_policy,
    modestbranding,
    origin,
    rel,
    start
  }
) => `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
    <style>
      .container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;
      }
      .video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="video" id="player" />
    </div>

    <script>
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '1000',
          width: '1000',
          videoId: '${videoId}',
          playerVars: {
            playsinline: 1,
            loop: ${loop ? 1 : 0},
            controls: ${controls ? 1 : 0},
            cc_lang_pref: '${cc_lang_pref || ""}',
            cc_load_policy: ${showClosedCaptions ? 1 : 0},
            color: ${color},
            end: ${end},
            fs: ${preventFullScreen ? 0 : 1},
            hl: ${playerLang},
            iv_load_policy: ${iv_load_policy},
            modestbranding: ${modestbranding ? 1 : 0},
            rel: ${rel ? 1 : 0},
            start: ${start},
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError,
            'onPlaybackQualityChange': onPlaybackQualityChange,
            'onPlaybackRateChange': onPlaybackRateChange,
          }
        });
      }

      function onPlayerError(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'playerError', data: event.data}))
      }

      function onPlaybackRateChange(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'playbackRateChange', data: event.data}))
      }

      function onPlaybackQualityChange(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'playerQualityChange', data: event.data}))
      }

      function onPlayerReady(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'playerReady'}))
      }

      var done = false;
      function onPlayerStateChange(event) {
        window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'playerStateChange', data: event.data}))
      }
    </script>
  </body>
</html>`;

export default forwardRef(YoutubeIframe);
