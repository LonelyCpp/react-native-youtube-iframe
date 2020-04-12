# React Native Youtube iframe

![npm](https://img.shields.io/npm/v/react-native-youtube-iframe?style=for-the-badge) ![npm](https://img.shields.io/npm/dm/react-native-youtube-iframe?style=for-the-badge)

A wrapper of the Youtube IFrame player API build for react native.

- ✅ Works seamlessly on both ios and android platforms
- ✅ Does not rely on the native youtube service on android (prevents unexpected crashes, works on phones without the youtube app)
- ✅ Uses the webview player which is known to be more stable compared to the native youtube app
- ✅ Access to a vast API provided through the iframe youtube API
- ✅ Supports multiple youtube player instances in a single page
- ✅ Fetch basic video metadata without API keys (uses oEmbed)
- ✅ Works on modals and overlay components
- ✅ Expo support 

## Prerequisite

This package uses react-hooks and therefore will need **react-native `0.59` or above**

(recommended - react native version - `0.60` or above)

## Installation

1. First install `react-native-webview`. 

- Bare React Native app - [Instructions](https://github.com/react-native-community/react-native-webview/blob/master/docs/Getting-Started.md)
  - React Native version **`0.60` and above**, install the latest version of react-native-webview
  - React Native version **below `0.60`**, react-native-webview version `6.11.1` is the last version that supports it.

- Expo Managed App - [Instructions](https://docs.expo.io/versions/latest/sdk/webview/)



2. Run - `npm install react-native-youtube-iframe`

## Usage

```js
import React, {useRef, useState} from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';

const playerRef = useRef(null);
const [playing, setPlaying] = useState(true);
```

```JSX
<YoutubePlayer
  ref={playerRef}
  height={300}
  width={400}
  videoId={"AVAc1gYLZK0"}
  play={playing}
  onChangeState={event => console.log(event)}   
  onReady={() => console.log("ready")}
  onError={e => console.log(e)}
  onPlaybackQualityChange={q => console.log(q)}
  volume={50}
  playbackRate={1}
  playerParams={{
    cc_lang_pref: "us",
    showClosedCaptions: true
  }}
/>
```

![ios](./doc/demo.gif?raw=true 'ios')

## API reference

**[Click here for full reference](./doc)**

list of available APIs -

### props

- videoId
- playList
- playListStartIndex
- play
- onChangeState
- onReady
- onError
- onPlaybackQualityChange
- mute
- volume
- playbackRate
- onPlaybackRateChange
- initialPlayerParams
- webViewStyle
- webViewProps

### Ref functions

- getDuration
- getCurrentTime
- isMuted
- getVolume
- getPlaybackRate
- getAvailablePlaybackRates
- seekTo

## methods

- getYoutubeMeta

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
