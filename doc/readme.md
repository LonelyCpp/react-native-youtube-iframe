# <YoutubeIframe>

## Example

```JSX
<YoutubePlayer
  height={300}
  width={400}
  ref={playerRef}
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

## Index

### props

- height
- width
- ref
- videoId
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

# Reference

## height

**REQUIRED, _Number_**

height of the webview container

## width

**REQUIRED, _Number_**

width of the webview container

## ref

Gives access to the player reference. This can be used to access player functions.

```javascript
import React, {useRef} from 'react';
const App = () => {
  const playerRef = useRef();
  return (
    <YoutubePlayer height={400} width={400} ref={playerRef} videoId={'AVAc1gYLZK0'} />
    <Button
        title="get current player time"
        onPress={() => {
          playerRef.current.getCurrentTime().then(data => console.log({data}));
        }}
      />
  );
};
```

## videoId

**REQUIRED, _String_**

Specifies the YouTube Video ID of the video to be played.

## play

**_Boolean_**

Flag to tell the player to play or pause the video.
Make sure you match this flag `onChangeState` to handle user pausing
the video from the youtube player UI

## onChangeState

**_function(event: string)_**

This event fires whenever the player's state changes. The event object that the API passes to your event listener function will specify a string that corresponds to the new player state. Possible values are:

| events    |
| --------- |
| unstarted |
| ended     |
| playing   |
| paused    |
| buffering |
| video cue |

## onReady

**_function_**

**_function(event: string)_**

This event fires whenever a player has finished loading and is ready to begin receiving API calls. Your application should implement this function if you want to automatically execute certain operations, such as playing the video or displaying information about the video, as soon as the player is ready.

## onError

**_function(error: string)_**

This event fires if an error occurs in the player. The API will pass an error string to the event listener function.
Possible values are:

| errors            | reason                                                                                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| invalid_parameter | The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks. |
| HTML5_error       | The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.                                                                                                                 |
| video_not_found   | The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.                                                                                                   |
| embed_not_allowed | The owner of the requested video does not allow it to be played in embedded players.                                                                                                                                                 |

## onPlaybackQualityChange

**_function(quality: string)_**

This event fires whenever the video playback quality changes. It might signal a change in the viewer's playback environment.

The data value that the API passes to the event listener function will be a string that identifies the new playback quality. Possible values are:

| Quality |
| ------- |
| small   |
| medium  |
| large   |
| hd720   |
| hd1080  |
| highres |

## mute

**_Boolean_**

Flag to tell the player to mute the video.

## volume

**_Number_**

Sets the volume. Accepts an integer between `0` and `100`.

## playbackRate

**_Number_**

This sets the suggested playback rate for the current video. If the playback rate changes, it will only change for the video that is already cued or being played.

Calling this function does not guarantee that the playback rate will actually change. However, if the playback rate does change, the `onPlaybackRateChange` event will fire, and your code should respond to the event rather than the fact that it called the setPlaybackRate function.

The `getAvailablePlaybackRates` method will return the possible playback rates for the currently playing video. However, if you set the suggestedRate parameter to a non-supported integer or float value, the player will round that value down to the nearest supported value in the direction of 1.

## onPlaybackRateChange

**_function(playbackRate: Number)_**

This event fires whenever the video playback rate changes. Your application should respond to the event and should not assume that the playback rate will automatically change when the `playbackRate` value changes. Similarly, your code should not assume that the video playback rate will only change as a result of an explicit call to setPlaybackRate.

The `playbackRate` that the API passes to the event listener function will be a number that identifies the new playback rate. The `getAvailablePlaybackRates` method returns a list of the valid playback rates for the currently cued or playing video.

## initialPlayerParams

| property           | type    | default | info                                                                   |
| ------------------ | ------- | ------- | ---------------------------------------------------------------------- |
| loop               | boolean | false   | https://developers.google.com/youtube/player_parameters#loop           |
| controls           | boolean | true    | https://developers.google.com/youtube/player_parameters#controls       |
| cc_lang_pref       | string  |         | https://developers.google.com/youtube/player_parameters#cc_lang_pref   |
| showClosedCaptions | boolean | false   | https://developers.google.com/youtube/player_parameters#cc_load_policy |
| color              | string  | 'red'   | https://developers.google.com/youtube/player_parameters#color          |
| start              | Number  |         | https://developers.google.com/youtube/player_parameters#start          |
| end                | Number  |         | https://developers.google.com/youtube/player_parameters#end            |
| preventFullScreen  | boolean | false   | https://developers.google.com/youtube/player_parameters#fs             |
| playerLang         | String  |         | https://developers.google.com/youtube/player_parameters#hl             |
| iv_load_policy     | Number  |         | https://developers.google.com/youtube/player_parameters#iv_load_policy |
| modestbranding     | boolean | false   | https://developers.google.com/youtube/player_parameters#modestbranding |
| rel                | boolean | false   | https://developers.google.com/youtube/player_parameters#rel            |
