import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const SplashScreen = ({ navigation }: any) => {
  const rootScreen = useSelector(
    (state: any) => state.auth.rootScreen
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: rootScreen }],
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Splash Screen</Text>
    </SafeAreaView>
  );
};

export default SplashScreen;