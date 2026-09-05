import {MAIN_SCRIPT} from '../../src/PlayerScripts';

const BASE_URL =
  'https://lonelycpp.github.io/react-native-youtube-iframe/iframe_v2.html';

const PLAYER_EVENTS = {};

const setupIframe = (initialPlayerParams = {}) => {
  const {htmlString} = MAIN_SCRIPT(
    'testVideo',
    undefined,
    initialPlayerParams,
    false,
    1.0,
    BASE_URL,
  );

  // Capture all window.ReactNativeWebView.postMessage calls
  const postMessages = [];
  window.ReactNativeWebView = {
    postMessage: msg => postMessages.push(JSON.parse(msg)),
  };

  jest.spyOn(console, 'error').mockImplementation(() => {});

  // Provide a real script element so the bootstrap insert logic has a parent
  const placeholder = document.createElement('script');
  document.head.appendChild(placeholder);

  // Mock the YT iframe API
  let playerInstance;
  window.YT = {
    Player: class {
      constructor(nodeId, config) {
        this.config = config;
        this.calls = [];
        PLAYER_EVENTS.config = config;
        playerInstance = this;
        if (config.events.onReady) {
          config.events.onReady({target: this});
        }
      }
      playVideo() {
        this.calls.push('playVideo');
      }
      pauseVideo() {
        this.calls.push('pauseVideo');
      }
      mute() {
        this.calls.push('mute');
      }
      unMute() {
        this.calls.push('unMute');
      }
      setVolume(v) {
        this.calls.push(['setVolume', v]);
      }
      setPlaybackRate(r) {
        this.calls.push(['setPlaybackRate', r]);
      }
    },
  };

  // Extract and run the inline script body (skip the <script> that loads iframe_api)
  const scriptMatch = htmlString.match(/<script>\s*([\s\S]*?)\s*<\/script>/);
  const inlineScript = scriptMatch[1];
  window.eval(inlineScript);

  // Simulate the iframe API finishing its load
  if (window.onYouTubeIframeAPIReady) {
    window.onYouTubeIframeAPIReady();
  }

  return {
    postMessages,
    player: () => playerInstance,
    getConfig: () => PLAYER_EVENTS.config,
  };
};

afterEach(() => {
  jest.restoreAllMocks();
  delete window.YT;
});

describe('iframe player script', () => {
  it('sends playerReady via postMessage when player is ready', () => {
    const {postMessages} = setupIframe();
    expect(postMessages).toContainEqual({eventType: 'playerReady'});
  });

  it('passes playerVars including derived origin', () => {
    setupIframe({widget_referrer: 'my-app'});
    const config = PLAYER_EVENTS.config;
    expect(config.playerVars).toEqual(
      expect.objectContaining({
        origin: 'https://lonelycpp.github.io',
        widget_referrer: 'my-app',
      }),
    );
  });

  it('always includes derived origin, omits widget_referrer when not provided', () => {
    setupIframe();
    const config = PLAYER_EVENTS.config;
    expect(config.playerVars.origin).toBe('https://lonelycpp.github.io');
    expect(config.playerVars.widget_referrer).toBeUndefined();
  });

  it('responds to playVideo message by calling player.playVideo', () => {
    const {player} = setupIframe();
    window.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({eventName: 'playVideo', meta: {}}),
      }),
    );
    expect(player().calls).toContain('playVideo');
  });

  it('responds to setVolume message', () => {
    const {player} = setupIframe();
    window.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({eventName: 'setVolume', meta: {volume: 42}}),
      }),
    );
    expect(player().calls).toContainEqual(['setVolume', 42]);
  });

  it('responds to setPlaybackRate message', () => {
    const {player} = setupIframe();
    window.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({
          eventName: 'setPlaybackRate',
          meta: {playbackRate: 1.5},
        }),
      }),
    );
    expect(player().calls).toContainEqual(['setPlaybackRate', 1.5]);
  });

  it('posts playerError event to react native', () => {
    setupIframe();
    const config = PLAYER_EVENTS.config;
    const postMessageSpy = jest.spyOn(
      window.ReactNativeWebView,
      'postMessage',
    );
    config.events.onError({data: 2});
    expect(postMessageSpy).toHaveBeenCalledWith(
      JSON.stringify({eventType: 'playerError', data: 2}),
    );
  });

  it('posts playerStateChange event with state data', () => {
    setupIframe();
    const config = PLAYER_EVENTS.config;
    const postMessageSpy = jest.spyOn(
      window.ReactNativeWebView,
      'postMessage',
    );
    config.events.onStateChange({data: 1});
    expect(postMessageSpy).toHaveBeenCalledWith(
      JSON.stringify({eventType: 'playerStateChange', data: 1}),
    );
  });
});
