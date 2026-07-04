import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';

interface SplashScreenProps {
  navigation: {
    reset: (options: { index: number; routes: { name: string }[] }) => void;
  };
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const rootScreen = useSelector(
    (state: any) => state.auth.rootScreen
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: rootScreen }],
      });
    }, 10000);

    return () => clearTimeout(timer);
  }, [rootScreen]);

  return (
    // Switched to standard View for edge-to-edge full screen coverage
    <View style={styles.container}>
      <Animated.View style={[styles.animationContainer, { opacity: fadeAnim }]}>
        <LottieView
          source={require("../../assets/lottie/homies.json")} 
          autoPlay
          loop={true}
          style={styles.lottie}
          resizeMode="cover" // CRITICAL: Stretches the asset content to crop and fill the frame perfectly
        />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Matches the fallback background color outside the animation[cite: 4]
  },
  animationContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  lottie: {
    width: '100%',
    height: '100%',
    position: 'absolute', // Ensures absolute alignment positioning context
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});