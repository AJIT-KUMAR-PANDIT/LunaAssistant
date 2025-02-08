import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface Props {
  isListening: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
}

export default function MicrophoneAnimation({ isListening, onPressIn, onPressOut }: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    if (isListening) {
      return {
        transform: [
          {
            scale: withRepeat(
              withSequence(
                withSpring(1.2),
                withSpring(1.0)
              ),
              -1,
              true
            ),
          },
        ],
      };
    }
    return {
      transform: [{ scale: withSpring(1) }],
    };
  });

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.container}
    >
      <Animated.View style={[styles.animationContainer, animatedStyle]}>
        <LinearGradient
          colors={isListening ? ['#FF4B4B', '#FF9F9F'] : ['#4CAF50', '#81C784']}
          style={styles.gradient}
        >
          <Feather
            name="mic"
            size={32}
            color="#fff"
          />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  animationContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
