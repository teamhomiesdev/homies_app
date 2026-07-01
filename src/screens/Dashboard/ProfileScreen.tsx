import React from 'react';
import { Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Profile Screen</Text>
      <Button
        title="Go To Login"
        onPress={async () => {
          dispatch(setRootScreen('AuthNavigator'));
          dispatch(setAuthScreen('Login'));
          dispatch(setLoginStatus(false));
          navigation.reset({
            index: 0,
            routes: [{ name: 'AuthNavigator' }],
          });
        }}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
