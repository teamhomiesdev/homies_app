import React from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const FaceVerificationScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Face Verification Screen</Text>
      <Button
        title="Go To VoiceVerificationScreen"
        onPress={() => {
          navigation.navigate('VoiceVerification');
          dispatch(setRootScreen('AuthNavigator'));
          dispatch(setAuthScreen('VoiceVerification'));
          dispatch(setLoginStatus(false));
        }}
      />
    </SafeAreaView>
  );
};

export default FaceVerificationScreen;