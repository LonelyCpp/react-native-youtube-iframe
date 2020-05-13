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

- [height](#height)
- [width](#width)
- [ref](#ref)
- [videoId](#videoId)
- [playList](#playList)
- [playListStartIndex](#playListStartIndex)
- [play](#play)
- [onChangeState](#onChangeState)
- [onReady](#onReady)
- [onError](#onError)
- [onPlaybackQualityChange](#onPlaybackQualityChange)
- [mute](#mute)
- [volume](#volume)
- [playbackRate](#playbackRate)
- [onPlaybackRateChange](#onPlaybackRateChange)
- [initialPlayerParams](#initialPlayerParams)
- [webViewStyle](#webViewStyle)
- [webViewProps](#webViewProps)
- [forceAndroidAutoplay](#forceAndroidAutoplay)
- [allowWebViewZoom](#allowWebViewZoom)

### Ref functions

- [getDuration](#getDuration)
- [getCurrentTime](#getCurrentTime)
- [isMuted](#isMuted)
- [getVolume](#getVolume)
- [getPlaybackRate](#getPlaybackRate)
- [getAvailablePlaybackRates](#getAvailablePlaybackRates)
- [seekTo](#seekTo)

### module methods

- [getYoutubeMeta](#getYoutubeMeta)

# Reference

## height

**REQUIRED, _Number_**

height of the webview container

## width

**REQUIRED, _Number_**

width of the webview container

> Note: Embedded players must have a viewport that is at least 200px by 200px. If the player displays controls, it must be large enough to fully display the controls without shrinking the viewport below the minimum size. We recommend 16:9 players be at least 480 pixels wide and 270 pixels tall.

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

**_String_**

Specifies the YouTube Video ID of the video to be played.

## playList

**_Array<String> | String_**

Specifies the playlist to play. It can be either the playlist ID or a list of video IDs

`playList={'PLbpi6ZahtOH6Blw3RGYpWkSByi_T7Rygb'}`

or

`playList={['QRt7LjqJ45k', 'fHsa9DqmId8']}`

## playListStartIndex

**_Number_**

Starts the playlist from the given index
**Works only if the playlist is a list of video IDs.**

## play

**_Boolean_**

Flag to tell the player to play or pause the video.

Make sure you match this flag `onChangeState` to handle user pausing
the video from the youtube player UI

> **note on autoPlay**: The HTML5 `<video>` element, in certain mobile browsers (such as Chrome and Safari), only allows playback to take place if it's initiated by a user interaction (such as tapping on the player).

However, the webview provides APIs to overcome this and will allow auto play in most cases. Use the [forceAndroidAutoplay](#forceAndroidAutoplay) prop if auto play still doesn't work. (usually is affected by older android devices)

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

## webViewStyle

A style prop that will be given to the webview

## webViewProps

Props that are supplied to the underlying webview (react-native-webview). A full list of props can be found [here](https://github.com/react-native-community/react-native-webview/blob/master/docs/Reference.md#props-index)

## forceAndroidAutoplay

Changes user string to make autoplay work on the iframe player for some android devices.

userAgent string - `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36';`

## allowWebViewZoom

Controls whether the embedded webview allows user to zoom in. Defaults to `false`

# Ref functions

usage -

```javascript
import React, {useRef} from 'react';
const App = () => {
  const playerRef = useRef();
  return (
    <YoutubePlayer height={400} width={400} ref={playerRef} videoId={'AVAc1gYLZK0'} />
    <Button
        title="log details"
        onPress={() => {

          playerRef.current.getCurrentTime().then(currentTime => console.log({currentTime}));

          playerRef.current.getDuration().then(getDuration => console.log({getDuration}));

          playerRef.current.isMuted().then(isMuted => console.log({isMuted}));

          playerRef.current.getVolume().then(getVolume => console.log({getVolume}));

          playerRef.current.getPlaybackRate().then(getPlaybackRate => console.log({getPlaybackRate}));

          playerRef.current.getAvailablePlaybackRates().then(getAvailablePlaybackRates => console.log({getAvailablePlaybackRates}
          ));

        }}
      />
  );
};
```

## getDuration

returns a promise that resolves to the total duration of the video

Note that getDuration() will return 0 until the video's metadata is loaded, which normally happens just after the video starts playing.

If the currently playing video is a live event, the getDuration() function will resolve the elapsed time since the live video stream began. Specifically, this is the amount of time that the video has streamed without being reset or interrupted. In addition, this duration is commonly longer than the actual event time since streaming may begin before the event's start time.

## getCurrentTime

returns a promise that resolves to the elapsed time in seconds since the video started playing.

## isMuted

returns a promise that resolves to true if the video is muted, false if not.

## getVolume

returns a promise that resolves to the player's current volume, an integer between 0 and 100. Note that `getVolume()` will return the volume even if the player is muted.

## getPlaybackRate

returns a promise that resolves to the current playback rate of the video.

The default playback rate is 1, which indicates that the video is playing at normal speed. Playback rates may include values like 0.25, 0.5, 1, 1.5, and 2.

## getAvailablePlaybackRates

returns a promise that resolves to a list of available playback rates.

The array of numbers are ordered from slowest to fastest playback speed. Even if the player does not support variable playback speeds, the array should always contain at least one value (1).

## seekTo

`seekTo(seconds:Number, allowSeekAhead:Boolean):Void`

Seeks to a specified time in the video. If the player is paused when the function is called, it will remain paused. If the function is called from another state (playing, video cued, etc.), the player will play the video.
The seconds parameter identifies the time to which the player should advance.

The player will advance to the closest keyframe before that time unless the player has already downloaded the portion of the video to which the user is seeking.

The `allowSeekAhead` parameter determines whether the player will make a new request to the server if the seconds parameter specifies a time outside of the currently buffered video data.

We recommend that you set this parameter to false while the user drags the mouse along a video progress bar and then set it to true when the user releases the mouse. This approach lets a user scroll to different points of a video without requesting new video streams by scrolling past unbuffered points in the video. When the user releases the mouse button, the player advances to the desired point in the video and requests a new video stream if necessary.

https://developers.google.com/youtube/iframe_api_reference#seekTo

# Module methods

## getYoutubeMeta

`getYoutubeMeta(videoId: String): Promise<youtubeMeta>`

Fetch metadata of a youtube video using the oEmbed Spec - https://oembed.com/#section7

metadata returned -

| field            | type   | explanation                                        |
| ---------------- | ------ | -------------------------------------------------- |
| author_name      | String | The name of the author/owner of the video.         |
| author_url       | String | youtube channel link of the video                  |
| height           | Number | The height in pixels required to display the HTML. |
| html             | String | The HTML required to embed a video player.         |
| provider_name    | String | The name of the resource provider.                 |
| provider_url     | String | The url of the resource provider.                  |
| thumbnail_height | Number | The height of the video thumbnail.                 |
| thumbnail_url    | String | The url of the resource provider.                  |
| thumbnail_width  | Number | The width of the video thumbnail.                  |
| title            | String | youtube video title                                |
| type             | String | The oEmbed version number.                         |
| version          | String | The resource type.                                 |
| width            | Number | The width in pixels required to display the HTML.  |

example -

```javascript
import {Alert} from 'react-native';
import {getYoutubeMeta} from 'react-native-youtube-iframe';

getYoutubeMeta('sNhhvQGsMEc').then(meta => {
  Alert.alert('title of the video : ' + meta.title);
});
```
