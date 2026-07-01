import React from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const BasicDetailsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Basic Details Screen</Text>
      <Button
        title="Go To FaceVerificationScreen"
        onPress={() => {
          navigation.navigate('FaceVerification');
          dispatch(setRootScreen('AuthNavigator'));
          dispatch(setAuthScreen('FaceVerification'));
          dispatch(setLoginStatus(false));
        }}
      />
    </SafeAreaView>
  );
};

export default BasicDetailsScreen;
