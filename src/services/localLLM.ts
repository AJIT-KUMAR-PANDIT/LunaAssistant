import { spawn } from 'child_process';

interface LLMResponse {
  response: string;
  intent?: {
    action: string;
    device?: string;
    location?: string;
  };
}

export async function processLocalLLM(text: string): Promise<LLMResponse> {
  try {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', ['src/services/inference.py'], {
        env: { ...process.env, INPUT_TEXT: text },
      });

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Local LLM Error:', errorOutput);
          reject(new Error('Failed to process text with local LLM'));
          return;
        }

        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (e) {
          reject(new Error('Invalid response from local LLM'));
        }
      });
    });
  } catch (error) {
    console.error('Local LLM Processing Error:', error);
    return {
      response: "I'm sorry, I couldn't process that request locally.",
    };
  }
}
