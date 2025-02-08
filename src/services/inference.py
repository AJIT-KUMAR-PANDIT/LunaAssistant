import os
import json
from llama_cpp import Llama
import sys

# Add the models directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from models.settings import (
    MODEL_FILENAME,
    CONTEXT_WINDOW,
    CPU_THREADS,
    BATCH_SIZE,
    MAX_TOKENS,
    TEMPERATURE,
    STOP_SEQUENCES,
    SYSTEM_PROMPT
)

def load_model():
    model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", MODEL_FILENAME)
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model file not found at {model_path}. "
            f"Please place your {MODEL_FILENAME} file in the models directory."
        )

    # Initialize the model with settings from config
    llm = Llama(
        model_path=model_path,
        n_ctx=CONTEXT_WINDOW,
        n_threads=CPU_THREADS,
        n_batch=BATCH_SIZE,
    )
    return llm

def process_text(text: str, llm) -> dict:
    # Prepare the prompt using template from settings
    prompt = SYSTEM_PROMPT.format(text=text)

    # Generate response using settings from config
    output = llm(
        prompt,
        max_tokens=MAX_TOKENS,
        temperature=TEMPERATURE,
        stop=STOP_SEQUENCES,
        echo=False
    )

    response = output['choices'][0]['text'].strip()

    # Extract intent if it's an IoT command
    intent = None
    if any(keyword in text.lower() for keyword in ['turn', 'switch', 'light']):
        words = text.lower().split()
        action = 'turn_off' if 'off' in words else 'turn_on'
        location = None
        device = None

        if "room" in text:
            location = text.split("room")[0].strip().split()[-1] + "'s room"
            device = "light"

        if location and device:
            intent = {
                "action": action,
                "device": device,
                "location": location
            }

    return {
        "response": response,
        "intent": intent
    }

def main():
    # Get input text from environment variable
    text = os.environ.get('INPUT_TEXT', '')
    if not text:
        print(json.dumps({"response": "No input text provided"}))
        return

    try:
        llm = load_model()
        result = process_text(text, llm)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"response": f"Error processing text: {str(e)}"}))

if __name__ == "__main__":
    main()