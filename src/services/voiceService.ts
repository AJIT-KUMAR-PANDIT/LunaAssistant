import { Audio } from 'expo-av';

export async function startRecording(): Promise<Audio.Recording> {
  const recording = new Audio.Recording();
  try {
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await recording.startAsync();
    return recording;
  } catch (error) {
    console.error('Failed to start recording:', error);
    throw error;
  }
}

export async function stopRecording(recording: Audio.Recording): Promise<string> {
  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    
    // In a real app, you would send this audio file to a speech-to-text service
    // For this demo, we'll return a mock transcript
    return "Turn off Dad's room lights";
  } catch (error) {
    console.error('Failed to stop recording:', error);
    throw error;
  }
}
