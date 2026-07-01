import React from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const VoiceVerificationScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Voice Verification Screen</Text>
      <Button
        title="Go To HelpSelectionScreen"
        onPress={() => {
          navigation.navigate('HelpSelection');
          dispatch(setRootScreen('AuthNavigator'));
          dispatch(setAuthScreen('HelpSelection'));
          dispatch(setLoginStatus(false));
        }}
      />
    </SafeAreaView>
  );
};

export default VoiceVerificationScreen;