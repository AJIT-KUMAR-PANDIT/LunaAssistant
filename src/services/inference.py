import os
import json
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

def load_model():
    # Using a small model suitable for mobile devices
    model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        low_cpu_mem_usage=True
    )
    return model, tokenizer

def process_text(text: str, model, tokenizer) -> dict:
    # Prepare the prompt
    prompt = f"""<|system|>You are a helpful voice assistant. Process the following command and extract any IoT-related actions.</s>
<|user|>{text}</s>
<|assistant|>"""
    
    # Tokenize and generate
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(
        **inputs,
        max_new_tokens=100,
        temperature=0.7,
        pad_token_id=tokenizer.eos_token_id
    )
    
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
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
        model, tokenizer = load_model()
        result = process_text(text, model, tokenizer)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"response": f"Error processing text: {str(e)}"}))

if __name__ == "__main__":
    main()
