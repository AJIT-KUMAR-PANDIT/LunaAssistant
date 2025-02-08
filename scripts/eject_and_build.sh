#!/bin/bash
set -e

# Step 1: Eject from Expo
npx expo prebuild --clean

# Step 2: Install native dependencies
npm install react-native-fs @react-native-community/voice

# Step 3: Copy Python files
python3 scripts/build_python.py

# Step 4: Build Android bundle
cd android
./gradlew bundleRelease
cd ..

# Step 5: Copy final bundle
cp android/app/build/outputs/bundle/release/app-release.aab ./luna-assistant.aab

echo "Build completed successfully!"
