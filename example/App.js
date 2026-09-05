import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import YoutubePlayer, {
  PLAYER_STATES,
  getYoutubeMeta,
} from 'react-native-youtube-iframe';

const VIDEO_ID = 'rVJglZclD8g';
const SECOND_VIDEO_ID = 'QRt7LjqJ45k';

const BASE_URL_OVERRIDE =
  'https://lonelycpp.github.io/react-native-youtube-iframe/iframe.html';

function Section({title, children}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} onPress={() => setOpen(o => !o)}>
        {open ? '▼' : '▶'} {title}
      </Text>
      {open && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
}

function LabeledSwitch({label, value, onValueChange}) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function LabeledInput({label, value, onChangeText, placeholder, keyboardType}) {
  return (
    <View style={styles.inputRow}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={String(value ?? '')}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType || 'default'}
      />
    </View>
  );
}

function LogEntry({log}) {
  return <Text style={styles.logText}>{log}</Text>;
}

export default function App() {
  const playerRef = useRef(null);

  // --- Playback props ---
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState('100');
  const [playbackRate, setPlaybackRate] = useState('1');

  // --- Video source ---
  const [videoId, setVideoId] = useState(VIDEO_ID);
  const [usePlaylist, setUsePlaylist] = useState(false);
  const [playlistInput, setPlaylistInput] = useState(
    `${VIDEO_ID},${SECOND_VIDEO_ID}`,
  );
  const [playListStartIndex, setPlayListStartIndex] = useState('0');

  // --- Sizing ---
  const [height, setHeight] = useState('300');
  const [width, setWidth] = useState('');
  const [contentScale, setContentScale] = useState('1');

  // --- Boolean props ---
  const [allowWebViewZoom, setAllowWebViewZoom] = useState(false);
  const [forceAndroidAutoplay, setForceAndroidAutoplay] = useState(false);
  const [useLocalHTML, setUseLocalHTML] = useState(false);
  const [useBaseUrlOverride, setUseBaseUrlOverride] = useState(true);

  // --- Initial player params ---
  const [loop, setLoop] = useState(false);
  const [controls, setControls] = useState(true);
  const [showClosedCaptions, setShowClosedCaptions] = useState(false);
  const [ccLangPref, setCcLangPref] = useState('');
  const [color, setColor] = useState('red');
  const [startSeconds, setStartSeconds] = useState('');
  const [endSeconds, setEndSeconds] = useState('');
  const [preventFullScreen, setPreventFullScreen] = useState(false);
  const [playerLang, setPlayerLang] = useState('');
  const [ivLoadPolicy, setIvLoadPolicy] = useState('');
  const [rel, setRel] = useState(false);

  // --- Event log ---
  const [logs, setLogs] = useState([]);

  const addLog = useCallback(msg => {
    setLogs(prev =>
      [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50),
    );
  }, []);

  // --- Callbacks ---
  const onChangeState = useCallback(
    state => {
      addLog(`onChangeState: ${state}`);
      if (state === PLAYER_STATES.ENDED) {
        setPlaying(false);
      }
    },
    [addLog],
  );

  const onReady = useCallback(() => {
    addLog('onReady');
  }, [addLog]);

  const onError = useCallback(
    error => {
      addLog(`onError: ${error}`);
    },
    [addLog],
  );

  const onFullScreenChange = useCallback(
    status => {
      addLog(`onFullScreenChange: ${status}`);
    },
    [addLog],
  );

  const onPlaybackQualityChange = useCallback(
    quality => {
      addLog(`onPlaybackQualityChange: ${quality}`);
    },
    [addLog],
  );

  const onPlaybackRateChange = useCallback(
    rate => {
      addLog(`onPlaybackRateChange: ${rate}`);
    },
    [addLog],
  );

  // --- Build initialPlayerParams ---
  const initialPlayerParams = {
    loop,
    controls,
    showClosedCaptions,
    color,
    preventFullScreen,
    rel,
    widget_referrer: 'youtube-iframe-test-app',
    ...(ccLangPref ? {cc_lang_pref: ccLangPref} : {}),
    ...(startSeconds ? {start: Number(startSeconds)} : {}),
    ...(endSeconds ? {end: Number(endSeconds)} : {}),
    ...(playerLang ? {playerLang} : {}),
    ...(ivLoadPolicy ? {iv_load_policy: Number(ivLoadPolicy)} : {}),
  };

  // --- Build playlist ---
  const playList = usePlaylist
    ? playlistInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    : undefined;

  // --- Ref methods ---
  const callRefMethod = async (method, ...args) => {
    if (!playerRef.current) {
      addLog('Ref not available');
      return;
    }
    try {
      const result = await playerRef.current[method](...args);
      addLog(`${method}: ${JSON.stringify(result)}`);
    } catch (e) {
      addLog(`${method} error: ${e.message}`);
    }
  };

  const [seekToValue, setSeekToValue] = useState('30');

  // --- getYoutubeMeta ---
  const fetchMeta = async () => {
    try {
      const meta = await getYoutubeMeta(videoId);
      Alert.alert('Video Meta', JSON.stringify(meta, null, 2));
      addLog(`getYoutubeMeta: ${meta.title}`);
    } catch (e) {
      addLog(`getYoutubeMeta error: ${e.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>YouTube Iframe Test App</Text>

        {/* --- Player --- */}
        <YoutubePlayer
          ref={playerRef}
          height={Number(height) || 300}
          width={width ? Number(width) : undefined}
          videoId={usePlaylist ? undefined : videoId}
          playList={playList}
          playListStartIndex={Number(playListStartIndex) || 0}
          play={playing}
          mute={muted}
          volume={Number(volume)}
          playbackRate={Number(playbackRate) || 1}
          contentScale={Number(contentScale) || 1}
          allowWebViewZoom={allowWebViewZoom}
          forceAndroidAutoplay={forceAndroidAutoplay}
          useLocalHTML={useLocalHTML}
          baseUrlOverride={
            useBaseUrlOverride && !useLocalHTML ? BASE_URL_OVERRIDE : undefined
          }
          initialPlayerParams={initialPlayerParams}
          onChangeState={onChangeState}
          onReady={onReady}
          onError={onError}
          onFullScreenChange={onFullScreenChange}
          onPlaybackQualityChange={onPlaybackQualityChange}
          onPlaybackRateChange={onPlaybackRateChange}
          webViewProps={{
            webviewDebuggingEnabled: true,
          }}
        />

        {/* --- Playback Controls --- */}
        <View style={styles.playbackRow}>
          <Button
            title={playing ? 'Pause' : 'Play'}
            onPress={() => setPlaying(prev => !prev)}
          />
          <Button
            title={muted ? 'Unmute' : 'Mute'}
            onPress={() => setMuted(prev => !prev)}
          />
        </View>

        {/* --- Video Source --- */}
        <Section title="Video Source">
          <LabeledInput
            label="videoId"
            value={videoId}
            onChangeText={setVideoId}
            placeholder="YouTube Video ID"
          />
          <LabeledSwitch
            label="Use Playlist"
            value={usePlaylist}
            onValueChange={setUsePlaylist}
          />
          {usePlaylist && (
            <>
              <LabeledInput
                label="Playlist (comma-separated IDs)"
                value={playlistInput}
                onChangeText={setPlaylistInput}
                placeholder="id1,id2,id3"
              />
              <LabeledInput
                label="playListStartIndex"
                value={playListStartIndex}
                onChangeText={setPlayListStartIndex}
                keyboardType="numeric"
              />
            </>
          )}
          <View style={styles.buttonRow}>
            <Button title="Get YouTube Meta" onPress={fetchMeta} />
          </View>
        </Section>

        {/* --- Playback Settings --- */}
        <Section title="Playback Settings">
          <LabeledInput
            label="volume (0-100)"
            value={volume}
            onChangeText={setVolume}
            keyboardType="numeric"
          />
          <LabeledInput
            label="playbackRate"
            value={playbackRate}
            onChangeText={setPlaybackRate}
            keyboardType="numeric"
          />
          <View style={styles.buttonRow}>
            <Button title="Rate 0.5x" onPress={() => setPlaybackRate('0.5')} />
            <Button title="Rate 1x" onPress={() => setPlaybackRate('1')} />
            <Button title="Rate 1.5x" onPress={() => setPlaybackRate('1.5')} />
            <Button title="Rate 2x" onPress={() => setPlaybackRate('2')} />
          </View>
        </Section>

        {/* --- Sizing & Display --- */}
        <Section title="Sizing & Display">
          <LabeledInput
            label="height"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
          <LabeledInput
            label="width (empty = auto)"
            value={width}
            onChangeText={setWidth}
            keyboardType="numeric"
          />
          <LabeledInput
            label="contentScale"
            value={contentScale}
            onChangeText={setContentScale}
            keyboardType="numeric"
          />
          <LabeledSwitch
            label="allowWebViewZoom"
            value={allowWebViewZoom}
            onValueChange={setAllowWebViewZoom}
          />
        </Section>

        {/* --- Initial Player Params --- */}
        <Section title="Initial Player Params">
          <Text style={styles.hint}>
            Changes here require remounting the player (toggle a video ID).
          </Text>
          <LabeledSwitch label="loop" value={loop} onValueChange={setLoop} />
          <LabeledSwitch
            label="controls"
            value={controls}
            onValueChange={setControls}
          />
          <LabeledSwitch
            label="showClosedCaptions"
            value={showClosedCaptions}
            onValueChange={setShowClosedCaptions}
          />
          <LabeledInput
            label="cc_lang_pref"
            value={ccLangPref}
            onChangeText={setCcLangPref}
            placeholder="e.g. en"
          />
          <View style={styles.buttonRow}>
            <Button
              title={`color: ${color}`}
              onPress={() => setColor(c => (c === 'red' ? 'white' : 'red'))}
            />
          </View>
          <LabeledInput
            label="start (seconds)"
            value={startSeconds}
            onChangeText={setStartSeconds}
            keyboardType="numeric"
          />
          <LabeledInput
            label="end (seconds)"
            value={endSeconds}
            onChangeText={setEndSeconds}
            keyboardType="numeric"
          />
          <LabeledSwitch
            label="preventFullScreen"
            value={preventFullScreen}
            onValueChange={setPreventFullScreen}
          />
          <LabeledInput
            label="playerLang"
            value={playerLang}
            onChangeText={setPlayerLang}
            placeholder="e.g. en, fr, de"
          />
          <LabeledInput
            label="iv_load_policy (1 or 3)"
            value={ivLoadPolicy}
            onChangeText={setIvLoadPolicy}
            keyboardType="numeric"
          />
          <LabeledSwitch label="rel" value={rel} onValueChange={setRel} />
        </Section>

        {/* --- Advanced --- */}
        <Section title="Advanced">
          <LabeledSwitch
            label="forceAndroidAutoplay"
            value={forceAndroidAutoplay}
            onValueChange={setForceAndroidAutoplay}
          />
          <LabeledSwitch
            label="useLocalHTML"
            value={useLocalHTML}
            onValueChange={setUseLocalHTML}
          />
          <LabeledSwitch
            label="baseUrlOverride"
            value={useBaseUrlOverride}
            onValueChange={setUseBaseUrlOverride}
          />
        </Section>

        {/* --- Ref Methods --- */}
        <Section title="Ref Methods">
          <View style={styles.buttonGrid}>
            <Button
              title="getDuration"
              onPress={() => callRefMethod('getDuration')}
            />
            <Button
              title="getCurrentTime"
              onPress={() => callRefMethod('getCurrentTime')}
            />
            <Button
              title="getVideoUrl"
              onPress={() => callRefMethod('getVideoUrl')}
            />
            <Button title="isMuted" onPress={() => callRefMethod('isMuted')} />
            <Button
              title="getVolume"
              onPress={() => callRefMethod('getVolume')}
            />
            <Button
              title="getPlaybackRate"
              onPress={() => callRefMethod('getPlaybackRate')}
            />
            <Button
              title="getAvailablePlaybackRates"
              onPress={() => callRefMethod('getAvailablePlaybackRates')}
            />
          </View>
          <View style={styles.seekRow}>
            <TextInput
              style={[styles.textInput, {flex: 1}]}
              value={seekToValue}
              onChangeText={setSeekToValue}
              keyboardType="numeric"
              placeholder="seconds"
            />
            <Button
              title="seekTo"
              onPress={() => callRefMethod('seekTo', Number(seekToValue), true)}
            />
          </View>
        </Section>

        {/* --- Event Log --- */}
        <Section title="Event Log">
          <Button title="Clear Log" onPress={() => setLogs([])} />
          <View style={styles.logContainer}>
            {logs.length === 0 && (
              <Text style={styles.logPlaceholder}>
                Events will appear here...
              </Text>
            )}
            {logs.map((log, i) => (
              <LogEntry key={i} log={log} />
            ))}
          </View>
        </Section>

        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
    color: '#333',
  },
  playbackRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 8,
  },
  section: {
    marginHorizontal: 12,
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 12,
    backgroundColor: '#fafafa',
    color: '#444',
  },
  sectionContent: {
    padding: 12,
    gap: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 14,
    color: '#555',
  },
  inputRow: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 13,
    color: '#777',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  seekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  logContainer: {
    marginTop: 8,
    maxHeight: 200,
    backgroundColor: '#1e1e1e',
    borderRadius: 6,
    padding: 8,
  },
  logText: {
    fontSize: 12,
    color: '#4ec9b0',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 2,
  },
  logPlaceholder: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
