export interface VoiceState {
  isListening: boolean;
  transcript: string;
  response: string;
}

export interface IoTDevice {
  id: string;
  name: string;
  state: boolean;
  location: string;
}

export interface AIResponse {
  response: string;
  intent?: {
    action: string;
    device: string;
    location: string;
  };
}
