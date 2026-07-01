import React from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const InterestSelectionScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Interest Selection Screen</Text>
      <Button
        title="Go To UserIdGeneratedScreen"
        onPress={() => {
          navigation.navigate("UserIdGenerated");
          dispatch(setRootScreen('MainTabNavigator'));
          dispatch(setAuthScreen('Login'));
          dispatch(setLoginStatus(true));
        }}
      />
    </SafeAreaView>
  );
};

export default InterestSelectionScreen;