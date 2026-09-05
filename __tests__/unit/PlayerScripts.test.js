import {
  MAIN_SCRIPT,
  PLAYER_FUNCTIONS,
  playMode,
  soundMode,
} from '../../src/PlayerScripts';

describe('PLAYER_FUNCTIONS', () => {
  it('has simple player invocations', () => {
    expect(PLAYER_FUNCTIONS.playVideo).toBe('player.playVideo(); true;');
    expect(PLAYER_FUNCTIONS.pauseVideo).toBe('player.pauseVideo(); true;');
    expect(PLAYER_FUNCTIONS.muteVideo).toBe('player.mute(); true;');
    expect(PLAYER_FUNCTIONS.unMuteVideo).toBe('player.unMute(); true;');
  });

  it('generates seekTo with args', () => {
    expect(PLAYER_FUNCTIONS.seekToScript(30, true)).toBe(
      'player.seekTo(30, true); true;',
    );
  });

  it('generates setPlaybackRate with arg', () => {
    expect(PLAYER_FUNCTIONS.setPlaybackRate(1.5)).toBe(
      'player.setPlaybackRate(1.5); true;',
    );
  });

  it('generates loadVideoById with stringified video id', () => {
    expect(PLAYER_FUNCTIONS.loadVideoById('xyz', true)).toContain(
      'player.loadVideoById({videoId: "xyz"})',
    );
    expect(PLAYER_FUNCTIONS.loadVideoById('xyz', false)).toContain(
      'player.cueVideoById',
    );
  });

  it('generates loadPlaylist for array playlists', () => {
    const script = PLAYER_FUNCTIONS.loadPlaylist(['a', 'b'], 0, true);
    expect(script).toContain('player.loadPlaylist');
    expect(script).toContain('playlist: "a,b"');
  });

  it('generates cuePlaylist when not playing', () => {
    const script = PLAYER_FUNCTIONS.loadPlaylist(['a', 'b'], 0, false);
    expect(script).toContain('player.cuePlaylist');
  });
});

describe('playMode / soundMode', () => {
  it('maps true -> playVideo and false -> pauseVideo', () => {
    expect(playMode[true]).toBe(PLAYER_FUNCTIONS.playVideo);
    expect(playMode[false]).toBe(PLAYER_FUNCTIONS.pauseVideo);
  });

  it('maps true -> muteVideo and false -> unMuteVideo', () => {
    expect(soundMode[true]).toBe(PLAYER_FUNCTIONS.muteVideo);
    expect(soundMode[false]).toBe(PLAYER_FUNCTIONS.unMuteVideo);
  });
});

describe('MAIN_SCRIPT', () => {
  const baseUrl = 'https://lonelycpp.github.io/react-native-youtube-iframe/iframe_v2.html';

  it('returns htmlString and urlEncodedJSON', () => {
    const result = MAIN_SCRIPT('vid', undefined, {}, false, 1.0, baseUrl);
    expect(result).toHaveProperty('htmlString');
    expect(result).toHaveProperty('urlEncodedJSON');
    expect(typeof result.htmlString).toBe('string');
    expect(typeof result.urlEncodedJSON).toBe('string');
  });

  it('embeds the video id in the html', () => {
    const {htmlString} = MAIN_SCRIPT(
      'myVideoId',
      undefined,
      {},
      false,
      1.0,
      baseUrl,
    );
    expect(htmlString).toContain("videoId: 'myVideoId'");
  });

  it('derives origin from the base url and includes it in playerVars', () => {
    const {htmlString, urlEncodedJSON} = MAIN_SCRIPT(
      'vid',
      undefined,
      {},
      false,
      1.0,
      baseUrl,
    );
    expect(urlEncodedJSON).toContain(
      'origin',
    );
    expect(htmlString).toContain(
      "origin: 'https://lonelycpp.github.io'",
    );
  });

  it('omits origin when base url is missing', () => {
    const {htmlString} = MAIN_SCRIPT('vid', undefined, {}, false, 1.0, undefined);
    expect(htmlString).not.toContain("origin: '");
  });

  it('includes widget_referrer when provided', () => {
    const {htmlString} = MAIN_SCRIPT(
      'vid',
      undefined,
      {widget_referrer: 'test-app'},
      false,
      1.0,
      baseUrl,
    );
    expect(htmlString).toContain("widget_referrer: 'test-app'");
  });

  it('omits widget_referrer when not provided', () => {
    const {htmlString} = MAIN_SCRIPT(
      'vid',
      undefined,
      {},
      false,
      1.0,
      baseUrl,
    );
    expect(htmlString).not.toContain('widget_referrer:');
  });

  it('handles preventFullScreen and zoom scale', () => {
    const zoom = MAIN_SCRIPT('vid', undefined, {}, true, 1.2, baseUrl).htmlString;
    expect(zoom).toContain('initial-scale=1.2');

    const noZoom = MAIN_SCRIPT('vid', undefined, {}, false, 1.0, baseUrl).htmlString;
    expect(noZoom).toContain('maximum-scale=1');
  });

  it('includes the referrer meta tag', () => {
    const {htmlString} = MAIN_SCRIPT('vid', undefined, {}, false, 1.0, baseUrl);
    expect(htmlString).toContain(
      '<meta name="referrer" content="strict-origin-when-cross-origin">',
    );
  });

  it('attaches the message listener with capture true for android', () => {
    const {htmlString} = MAIN_SCRIPT('vid', undefined, {}, false, 1.0, baseUrl);
    expect(htmlString).toContain(
      "window.addEventListener('message', function (event)",
    );
    expect(htmlString).toContain('{capture: true}');
  });

  it('handles setVolume and setPlaybackRate commands', () => {
    const {htmlString} = MAIN_SCRIPT('vid', undefined, {}, false, 1.0, baseUrl);
    expect(htmlString).toContain("case 'setVolume'");
    expect(htmlString).toContain('player.setVolume(meta.volume)');
    expect(htmlString).toContain("case 'setPlaybackRate'");
    expect(htmlString).toContain('player.setPlaybackRate(meta.playbackRate)');
  });

  it('urlEncodedJSON is valid uri-encoded json of safeData', () => {
    const {urlEncodedJSON} = MAIN_SCRIPT(
      'vid',
      undefined,
      {rel: true, modestbranding: true},
      false,
      1.0,
      baseUrl,
    );
    const decoded = JSON.parse(decodeURIComponent(urlEncodedJSON));
    expect(decoded).toEqual(
      expect.objectContaining({
        videoId_s: 'vid',
        rel_s: 1,
        modestbranding_s: 1,
        controls_s: 1,
      }),
    );
  });
});
