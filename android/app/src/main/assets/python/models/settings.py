# Model Configuration Settings

# Model loading settings
MODEL_FILENAME = "luna.gguf"  # The name of your GGUF model file

# Model inference settings
CONTEXT_WINDOW = 2048  # Context window size in tokens
CPU_THREADS = 4      # Number of CPU threads to use
BATCH_SIZE = 512     # Number of tokens to process in parallel

# Generation settings
MAX_TOKENS = 100     # Maximum number of tokens to generate
TEMPERATURE = 0.7    # Higher values make output more random, lower more deterministic

# Stop sequences
STOP_SEQUENCES = ["</s>"]  # Sequences that will stop text generation

# System prompt template
SYSTEM_PROMPT = """<|system|>You are a helpful voice assistant. Process the following command and extract any IoT-related actions.</s>
<|user|>{text}</s>
<|assistant|>"""
