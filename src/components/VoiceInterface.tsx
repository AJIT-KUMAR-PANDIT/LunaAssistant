import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import MicrophoneAnimation from './MicrophoneAnimation';
import IoTControls from './IoTControls';
import { processLocalLLM } from '../services/localLLM';

export default function VoiceInterface() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'ios') {
        await Audio.requestPermissionsAsync();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    })();
  }, []);

  const startRecording = async () => {
    try {
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsListening(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      // In a real application, you would send `uri` to a transcription service.
      // For this demo, we use a mock transcript.
      const mockTranscript = "Turn off Dad's room lights";
      setTranscript(mockTranscript);

      // Process with local LLM
      const result = await processLocalLLM(mockTranscript);
      setResponse(result.response);

      // Speak response
      Speech.speak(result.response, {
        language: 'en',
        pitch: 1,
        rate: 0.9,
      });
    } catch (error) {
      console.error('Failed to process voice:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <Text style={styles.header}>Voice Assistant</Text>

        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptLabel}>You said:</Text>
          <Text style={styles.transcript}>{transcript || 'Tap to speak'}</Text>
        </View>

        <View style={styles.responseContainer}>
          <Text style={styles.responseLabel}>Assistant:</Text>
          <Text style={styles.response}>{response || 'Waiting for input...'}</Text>
        </View>

        <MicrophoneAnimation
          isListening={isListening}
          onPressIn={startRecording}
          onPressOut={stopRecording}
        />

        <IoTControls />
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  surface: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#2a2a2a',
    elevation: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  transcriptContainer: {
    marginBottom: 20,
  },
  transcriptLabel: {
    color: '#888',
    marginBottom: 5,
  },
  transcript: {
    color: '#fff',
    fontSize: 16,
  },
  responseContainer: {
    marginBottom: 20,
  },
  responseLabel: {
    color: '#888',
    marginBottom: 5,
  },
  response: {
    color: '#4CAF50',
    fontSize: 16,
  },
});