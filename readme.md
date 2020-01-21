# React Native Youtube iframe

A wrapper of the Youtube IFrame player API build for react native. A fully web based implementation with access to most APIs provided on the web.

## Prerequisite

This package uses react-hooks and therefore will need **react-native `0.59` and above**

## Installation

1. First install `react-native-webview`. [Instructions here](https://github.com/react-native-community/react-native-webview/blob/master/docs/Getting-Started.md)

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
    preventFullScreen: true,
    cc_lang_pref: "us",
    showClosedCaptions: true
  }}
/>
```

![ios](./doc/demo.gif?raw=true 'ios')

## API reference

[Click here for full reference here](./doc)

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

### Ref functions

- getDuration
- getCurrentTime
- isMuted
- getVolume
- getPlaybackRate
- getAvailablePlaybackRates
- seekTo

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
