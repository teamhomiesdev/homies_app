import React from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice';

const LoginScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Login Screen</Text>
      <Button
        title="Go To Register"
        onPress={() => {
          navigation.navigate('Register');
        }}
      />
      <Button
        title="Go To Dashboard"
        onPress={() => {
          navigation.navigate('MainTabNavigator');
          dispatch(setRootScreen('MainTabNavigator'));
          dispatch(setLoginStatus(true));
        }}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;
