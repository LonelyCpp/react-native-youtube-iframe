import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, Button, SafeAreaView} from 'react-native';
import YoutubePlayer, {PLAYER_STATES} from 'react-native-youtube-iframe';

const VIDEO_ID = 'iee2TATGMyI';

export default function App() {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback(state => {
    if (state === PLAYER_STATES.ENDED) {
      setPlaying(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>YouTube Iframe Example</Text>
      <YoutubePlayer
        height={230}
        play={playing}
        videoId={VIDEO_ID}
        onChangeState={onStateChange}
      />
      <View style={styles.controls}>
        <Button
          title={playing ? 'Pause' : 'Play'}
          onPress={() => setPlaying(prev => !prev)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  controls: {
    marginTop: 16,
    alignItems: 'center',
  },
});
