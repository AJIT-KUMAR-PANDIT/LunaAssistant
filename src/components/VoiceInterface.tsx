import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import MicrophoneAnimation from './MicrophoneAnimation';
import IoTControls from './IoTControls';
import { processAIResponse } from '../services/openai';
import { startRecording, stopRecording } from '../services/voiceService';

export default function VoiceInterface() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  useEffect(() => {
    (async () => {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    })();
  }, []);

  const handleStartListening = async () => {
    try {
      setIsListening(true);
      const recordingObject = await startRecording();
      setRecording(recordingObject);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopListening = async () => {
    if (!recording) return;
    
    try {
      setIsListening(false);
      const transcriptText = await stopRecording(recording);
      setTranscript(transcriptText);
      
      // Process with AI
      const aiResponse = await processAIResponse(transcriptText);
      setResponse(aiResponse);
      
      // Speak response
      Speech.speak(aiResponse, {
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
          onPressIn={handleStartListening}
          onPressOut={handleStopListening}
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
