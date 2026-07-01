import React from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice';
import { loginAction } from '../../redux/actions/AuthActions';

const LoginScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();

    const onLogin = async () => {
    const payload = {
      mobile: '9999999999',
    };

    const response = await dispatch(loginAction(payload) as any);

    if (response.success) {
      console.log(response.data);
    }
  };
  
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
