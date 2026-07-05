import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/Splash/SplashScreen';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import ChatWindowScreen from '../screens/Dashboard/ChatWindowScreen';
import HelpSelectionScreen from '../screens/Auth/HelpSelectionScreen';
import InterestSelectionScreen from '../screens/Auth/InterestSelectionScreen';
import CreatePostScreen from '../screens/Dashboard/CreatePostScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
      <Stack.Screen name="ChatWindow" component={ChatWindowScreen} />
      <Stack.Screen name="HelpSelection" component={HelpSelectionScreen} />
      <Stack.Screen
        name="InterestSelection"
        component={InterestSelectionScreen}
      />
       <Stack.Screen name="CreatePost" component={CreatePostScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
