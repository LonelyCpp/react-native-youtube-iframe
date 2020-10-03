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
  '0': PLAYER_STATES_NAMES.ENDED,
  '1': PLAYER_STATES_NAMES.PLAYING,
  '2': PLAYER_STATES_NAMES.PAUSED,
  '3': PLAYER_STATES_NAMES.BUFFERING,
  '5': PLAYER_STATES_NAMES.VIDEO_CUED,
};

export const PLAYER_ERROR = {
  '2': 'invalid_parameter',
  '5': 'HTML5_error',
  '100': 'video_not_found',
  '101': 'embed_not_allowed',
  '150': 'embed_not_allowed',
};

export const CUSTOM_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36';
