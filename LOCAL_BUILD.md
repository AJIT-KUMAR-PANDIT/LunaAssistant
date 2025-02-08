# Install Expo CLI globally
npm install -g expo-cli

# Install EAS CLI for building
npm install -g eas-cli
```

2. Install Python packages:
```bash
pip install llama-cpp-python numpy onnx onnxruntime openai torch transformers
```

3. Install project dependencies:
```bash
npm install
```

## Preparing the Build

1. Place your GGUF model:
   - Get the `luna.gguf` model file
   - Place it in the `src/models` directory
   - Make sure the filename matches exactly: `luna.gguf`

2. Build Python components:
```bash
# This will copy Python files and model to the correct locations
python3 scripts/build_python.py
```

## Building the App

1. Configure EAS Build:
```bash
# Login to your Expo account
eas login

# Configure the project
eas build:configure
```

2. Create development build (for testing):
```bash
# Create a development build
eas build --platform android --profile development --local
```

3. Create production App Bundle (.aab):
```bash
# Create the production bundle
eas build --platform android --profile production --local