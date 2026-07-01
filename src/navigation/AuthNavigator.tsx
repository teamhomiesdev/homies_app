import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import BasicDetailsScreen from '../screens/Auth/BasicDetailsScreen';
import FaceVerificationScreen from '../screens/Auth/FaceVerificationScreen';
import VoiceVerificationScreen from '../screens/Auth/VoiceVerificationScreen';
import HelpSelectionScreen from '../screens/Auth/HelpSelectionScreen';
import InterestSelectionScreen from '../screens/Auth/InterestSelectionScreen';
import UserIdGeneratedScreen from '../screens/Auth/UserIdGeneratedScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const authScreen = useSelector(
    (state: any) => state.auth.authScreen,
  );

  return (
    <Stack.Navigator
      initialRouteName={authScreen}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="BasicDetails" component={BasicDetailsScreen} />
      <Stack.Screen
        name="FaceVerification"
        component={FaceVerificationScreen}
      />
       <Stack.Screen
        name="VoiceVerification"
        component={VoiceVerificationScreen}
      />
        <Stack.Screen
        name="HelpSelection"
        component={HelpSelectionScreen}
      />
        <Stack.Screen
        name="InterestSelection"
        component={InterestSelectionScreen}
      />
        <Stack.Screen
        name="UserIdGenerated"
        component={UserIdGeneratedScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;