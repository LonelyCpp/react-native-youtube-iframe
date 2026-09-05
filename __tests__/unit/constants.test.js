import {
  PLAYER_STATES,
  PLAYER_STATES_NAMES,
  PLAYER_ERROR,
  PLAYER_ERROR_NAMES,
  IFRAME_VERSION,
  DEFAULT_BASE_URL,
  CUSTOM_USER_AGENT,
} from '../../src/constants';

describe('constants', () => {
  it('maps player state numbers to names', () => {
    expect(PLAYER_STATES['-1']).toBe(PLAYER_STATES_NAMES.UNSTARTED);
    expect(PLAYER_STATES[0]).toBe(PLAYER_STATES_NAMES.ENDED);
    expect(PLAYER_STATES[1]).toBe(PLAYER_STATES_NAMES.PLAYING);
    expect(PLAYER_STATES[2]).toBe(PLAYER_STATES_NAMES.PAUSED);
    expect(PLAYER_STATES[3]).toBe(PLAYER_STATES_NAMES.BUFFERING);
    expect(PLAYER_STATES[5]).toBe(PLAYER_STATES_NAMES.VIDEO_CUED);
  });

  it('maps player error codes to names', () => {
    expect(PLAYER_ERROR[2]).toBe(PLAYER_ERROR_NAMES.INVALID_PARAMETER);
    expect(PLAYER_ERROR[5]).toBe(PLAYER_ERROR_NAMES.HTML5_ERROR);
    expect(PLAYER_ERROR[100]).toBe(PLAYER_ERROR_NAMES.VIDEO_NOT_FOUND);
    expect(PLAYER_ERROR[101]).toBe(PLAYER_ERROR_NAMES.EMBED_NOT_ALLOWED);
    expect(PLAYER_ERROR[150]).toBe(PLAYER_ERROR_NAMES.EMBED_NOT_ALLOWED);
  });

  it('derives the default base url from the iframe version', () => {
    expect(IFRAME_VERSION).toBe(2);
    expect(DEFAULT_BASE_URL).toBe(
      `https://lonelycpp.github.io/react-native-youtube-iframe/iframe_v${IFRAME_VERSION}.html`,
    );
  });

  it('provides a custom user agent', () => {
    expect(CUSTOM_USER_AGENT).toContain('Chrome');
  });
});
