export const PLAYER_FUNCTIONS = {
  durationScript: `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getDuration', data: player.getDuration()}));
true;
`,
  currentTimeScript: `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getCurrentTime', data: player.getCurrentTime()}));
true;
`,
  isMutedScript: `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'isMuted', data: player.isMuted()}));
true;
`,
  getVolumeScript: `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getVolume', data: player.getVolume()}));
true;
`,
  getPlaybackRateScript: `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getPlaybackRate', data: player.getPlaybackRate()}));
true;
`,
  getAvailablePlaybackRatesScript: `
window.ReactNativeWebView.postMessage(JSON.stringify({eventType: 'getAvailablePlaybackRates', data: player.getAvailablePlaybackRates()}));
true;
`,
  seekToScript: (seconds, allowSeekAhead) => `
player.seekTo(${seconds}, ${allowSeekAhead})
`,
  playVideo: 'player.playVideo(); true;',
  pauseVideo: 'player.pauseVideo(); true;',
  muteVideo: 'player.mute(); true;',
  unMuteVideo: 'player.unMute(); true;',
  setPlaybackRate: playbackRate =>
    `player.setPlaybackRate(${playbackRate}); true;`,
  setVolume: volume => `player.setVolume(${volume}); true;`,
  loadPlaylist: (playList, startIndex, play) => `
  player.${play ? 'loadPlaylist' : 'cuePlaylist'}({playlist: ${JSON.stringify(
    playList,
  )},
    index: ${startIndex || 0}}); true;`,
};

export const MAIN_SCRIPT = (
  videoId,
  playList,
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
    rel,
    start,
  },
) => `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
    <style>
      body {
        margin: 0;
      }
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
          videoId: '${videoId || ''}',
          playerVars: {
            playsinline: 1,
            loop: ${loop ? 1 : 0},
            controls: ${controls ? 1 : 0},
            cc_lang_pref: '${cc_lang_pref || ''}',
            cc_load_policy: ${showClosedCaptions ? 1 : 0},
            color: ${color},
            end: ${end},
            fs: ${preventFullScreen ? 0 : 1},
            hl: ${playerLang},
            iv_load_policy: ${iv_load_policy},
            modestbranding: ${modestbranding ? 1 : 0},
            rel: ${rel ? 1 : 0},
            start: ${start},
            listType:  '${typeof playList === 'string' ? 'playlist' : ''}',
            list: '${typeof playList === 'string' ? playList : ''}',
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
