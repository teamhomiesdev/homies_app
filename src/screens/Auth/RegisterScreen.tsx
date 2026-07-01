import React from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const RegisterScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Register Screen</Text>
      <Button
        title="Go To Login"
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AuthNavigator' }],
          });
        }}
      />
      <Button
        title="Go To BasicDetailsScreen"
        onPress={() => {
          navigation.navigate('BasicDetails');
          dispatch(setRootScreen('AuthNavigator'));
          dispatch(setAuthScreen('BasicDetails'));
          dispatch(setLoginStatus(false));
        }}
      />
    </SafeAreaView>
  );
};

export default RegisterScreen;
