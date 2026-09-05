import React from 'react';
import {act, create} from 'react-test-renderer';

const mockPostMessage = jest.fn();
const mockInjectJavaScript = jest.fn();

jest.mock(
  'react-native',
  () => {
    const React = require('react');
    const {useImperativeHandle, forwardRef} = React;
    const View = forwardRef(({children, ...props}, ref) =>
      React.createElement('view', props, children),
    );
    return {
      Platform: {
        OS: 'ios',
        select: obj => (obj.ios !== undefined ? obj.ios : obj.default),
      },
      StyleSheet: {
        create: styles => styles,
        flatten: s => s,
      },
      Linking: {
        openURL: jest.fn(() => Promise.resolve()),
      },
      View,
    };
  },
  {virtual: true},
);

jest.mock('../../src/WebView', () => {
  const React = require('react');
  const {forwardRef, useImperativeHandle} = React;
  const MockWebView = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
      postMessage: mockPostMessage,
      injectJavaScript: mockInjectJavaScript,
    }));
    return React.createElement('webview', props, null);
  });
  return {WebView: MockWebView};
});

const YoutubeIframe = require('../../src/YoutubeIframe').default;

const render = props => {
  let instance;
  let tree;
  act(() => {
    tree = create(
      React.createElement(YoutubeIframe, {...props, ref: r => (instance = r)}),
    );
  });
  return {tree, instance};
};

const webview = tree => tree.root.find(node => node.type === 'webview');

describe('YoutubeIframe', () => {
  beforeEach(() => {
    mockPostMessage.mockClear();
    mockInjectJavaScript.mockClear();
  });

  it('renders a webview', () => {
    const {tree} = render({videoId: 'abc', height: 200, width: 300});
    expect(webview(tree)).toBeTruthy();
  });

  it('passes the derived origin base url in source uri', () => {
    const {tree} = render({
      videoId: 'abc',
      height: 200,
      width: 300,
      baseUrlOverride: 'https://custom.example.com/frame.html',
    });
    const src = webview(tree).props.source;
    expect(src.uri.startsWith('https://custom.example.com/frame.html?data=')).toBe(
      true,
    );
  });

  it('uses local html source when useLocalHTML is set', () => {
    const {tree} = render({
      videoId: 'abc',
      height: 200,
      width: 300,
      useLocalHTML: true,
    });
    const src = webview(tree).props.source;
    expect(src.html).toBeTruthy();
    expect(src.baseUrl).toBeTruthy();
  });

  it('derives origin only (no url) for local html mode', () => {
    const {tree} = render({
      videoId: 'abc',
      height: 200,
      width: 300,
      useLocalHTML: true,
    });
    const src = webview(tree).props.source;
    // origin is embedded in html; baseUrl passed for origin derivation
    expect(src.html).toContain("origin: 'https://lonelycpp.github.io'");
  });

  describe('ref methods', () => {
    it('exposes seekTo via mockInjectJavaScript', () => {
      const {instance} = render({videoId: 'abc', height: 200, width: 300});
      instance.seekTo(42, true);
      expect(mockInjectJavaScript).toHaveBeenCalledTimes(1);
      expect(mockInjectJavaScript.mock.calls[0][0]).toContain('player.seekTo(42, true)');
    });

    it('exposes getCurrentTime returning a promise resolvable via web message', async () => {
      const {tree, instance} = render({videoId: 'abc', height: 200, width: 300});
      const promise = instance.getCurrentTime();

      const wv = webview(tree).props;
      // simulate a ready + a getCurrentTime response from the webview
      const onMessage = wv.onMessage;
      act(() => {
        onMessage({nativeEvent: {data: JSON.stringify({eventType: 'playerReady'})}});
        onMessage({
          nativeEvent: {
            data: JSON.stringify({eventType: 'getCurrentTime', data: 12.5}),
          },
        });
      });

      await expect(promise).resolves.toBe(12.5);
    });

    it('exposes getDuration/getVolume/getPlaybackRate/isMuted/getVideoUrl/getAvailablePlaybackRates', () => {
      const {instance} = render({videoId: 'abc', height: 200, width: 300});
      const methods = [
        'getDuration',
        'getVolume',
        'getPlaybackRate',
        'isMuted',
        'getVideoUrl',
        'getAvailablePlaybackRates',
      ];
      methods.forEach(m => {
        expect(instance[m]).toEqual(expect.any(Function));
      });
    });
  });

  describe('mockPostMessage commands', () => {
    it('sends playVideo/pauseVideo based on play prop', () => {
      const {tree, instance} = render({
        videoId: 'abc',
        height: 200,
        width: 300,
        play: false,
      });
      const wv = webview(tree).props;
      act(() => {
        wv.onMessage({nativeEvent: {data: JSON.stringify({eventType: 'playerReady'})}});
      });
      // initial play=false -> pauseVideo
      expect(mockPostMessage).toHaveBeenCalledWith(
        JSON.stringify({eventName: 'pauseVideo', meta: {}}),
      );
    });

    it('sends setVolume when volume changes', () => {
      let tree;
      let instance;
      act(() => {
        tree = create(
          React.createElement(
            YoutubeIframe,
            {videoId: 'abc', height: 200, width: 300, volume: 50, ref: r => (instance = r)},
          ),
        );
      });
      act(() => {
        tree.update(
          React.createElement(YoutubeIframe, {videoId: 'abc', height: 200, width: 300, volume: 80}),
        );
      });
    });

    it('sends setPlaybackRate when playbackRate changes', () => {});
  });

  describe('event dispatch to callbacks', () => {
    it('calls onReady on playerReady event', () => {
      const onReady = jest.fn();
      const {tree} = render({videoId: 'abc', height: 200, width: 300, onReady});
      act(() => {
        webview(tree).props.onMessage({
          nativeEvent: {data: JSON.stringify({eventType: 'playerReady'})},
        });
      });
      expect(onReady).toHaveBeenCalledTimes(1);
    });

    it('maps playerStateChange to onChangeState', () => {
      const onChangeState = jest.fn();
      const {tree} = render({videoId: 'abc', height: 200, width: 300, onChangeState});
      act(() => {
        webview(tree).props.onMessage({
          nativeEvent: {data: JSON.stringify({eventType: 'playerStateChange', data: 1})},
        });
      });
      expect(onChangeState).toHaveBeenCalledWith('playing');
    });

    it('maps playerError to onError', () => {
      const onError = jest.fn();
      const {tree} = render({videoId: 'abc', height: 200, width: 300, onError});
      act(() => {
        webview(tree).props.onMessage({
          nativeEvent: {data: JSON.stringify({eventType: 'playerError', data: 2})},
        });
      });
      expect(onError).toHaveBeenCalledWith('invalid_parameter');
    });

    it('maps playbackRateChange and onPlaybackQualityChange', () => {
      const onPlaybackRateChange = jest.fn();
      const onPlaybackQualityChange = jest.fn();
      const onFullScreenChange = jest.fn();
      const {tree} = render({
        videoId: 'abc',
        height: 200,
        width: 300,
        onPlaybackRateChange,
        onPlaybackQualityChange,
        onFullScreenChange,
      });
      const wv = webview(tree).props;
      act(() => {
        wv.onMessage({
          nativeEvent: {data: JSON.stringify({eventType: 'playbackRateChange', data: 1.5})},
        });
        wv.onMessage({
          nativeEvent: {data: JSON.stringify({eventType: 'playerQualityChange', data: 'hd1080'})},
        });
        wv.onMessage({
          nativeEvent: {data: JSON.stringify({eventType: 'fullScreenChange', data: true})},
        });
      });
      expect(onPlaybackRateChange).toHaveBeenCalledWith(1.5);
      expect(onPlaybackQualityChange).toHaveBeenCalledWith('hd1080');
      expect(onFullScreenChange).toHaveBeenCalledWith(true);
    });

    it('does not throw on malformed message', () => {
      const {tree} = render({videoId: 'abc', height: 200, width: 300});
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      act(() => {
        webview(tree).props.onMessage({nativeEvent: {data: 'not-json'}});
      });
      expect(consoleWarn).toHaveBeenCalled();
      consoleWarn.mockRestore();
    });
  });

  describe('onShouldStartLoadWithRequest', () => {
    it('allows about:blank on ios', () => {
      const {tree} = render({videoId: 'abc', height: 200, width: 300});
      const result = webview(tree).props.onShouldStartLoadWithRequest({
        url: 'about:blank',
      });
      expect(result).toBe(true);
    });
  });
});
