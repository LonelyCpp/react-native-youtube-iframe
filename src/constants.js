export const PLAY_MODE = true;
export const PAUSE_MODE = false;
export const MUTE_MODE = true;
export const UNMUTE_MODE = false;

export const PLAYER_STATES_NAMES = {
  UNSTARTED: 'unstarted',
  ENDED: 'ended',
  PLAYING: 'playing',
  PAUSED: 'paused',
  BUFFERING: 'buffering',
  VIDEO_CUED: 'video cued',
};

export const PLAYER_STATES = {
  '-1': PLAYER_STATES_NAMES.UNSTARTED,
  0: PLAYER_STATES_NAMES.ENDED,
  1: PLAYER_STATES_NAMES.PLAYING,
  2: PLAYER_STATES_NAMES.PAUSED,
  3: PLAYER_STATES_NAMES.BUFFERING,
  5: PLAYER_STATES_NAMES.VIDEO_CUED,
};

export const PLAYER_ERROR_NAMES = {
  INVALID_PARAMETER: 'invalid_parameter',
  HTML5_ERROR: 'HTML5_error',
  VIDEO_NOT_FOUND: 'video_not_found',
  EMBED_NOT_ALLOWED: 'embed_not_allowed',
};

export const PLAYER_ERROR = {
  2: PLAYER_ERROR_NAMES.INVALID_PARAMETER,
  5: PLAYER_ERROR_NAMES.HTML5_ERROR,
  100: PLAYER_ERROR_NAMES.VIDEO_NOT_FOUND,
  101: PLAYER_ERROR_NAMES.EMBED_NOT_ALLOWED,
  150: PLAYER_ERROR_NAMES.EMBED_NOT_ALLOWED,
};

export const CUSTOM_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36';

export const DEFAULT_BASE_URL =
  'https://lonelycpp.github.io/react-native-youtube-iframe/iframe.html';
