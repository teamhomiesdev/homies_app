import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/Splash/SplashScreen';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import ChatWindowScreen from '../screens/Dashboard/ChatWindowScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
      <Stack.Screen name="ChatWindow" component={ChatWindowScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;