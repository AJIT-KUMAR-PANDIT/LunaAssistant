npm install -g eas-cli expo-cli
```

2. Install project dependencies:
```bash
npm install
```

3. Place your `luna.gguf` model file in `src/models` directory.

4. Run the Python build script:
```bash
python3 scripts/build_python.py
```

5. Log in to your Expo account:
```bash
eas login
```

6. Configure the build:
```bash
eas build:configure
```

7. Build the app:
```bash
# For development APK:
eas build --platform android --profile development --local

# For production AAB:
eas build --platform android --profile production --local