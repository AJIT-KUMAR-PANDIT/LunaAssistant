import { processLocalLLM } from './localLLM';

export async function processAIResponse(text: string): Promise<string> {
  try {
    const result = await processLocalLLM(text);
    return result.response;
  } catch (error) {
    console.error('AI Processing Error:', error);
    return "I'm sorry, I couldn't process that request.";
  }
}