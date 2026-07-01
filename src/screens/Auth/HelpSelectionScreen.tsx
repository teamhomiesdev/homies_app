import React from 'react';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const HelpSelectionScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Help Selection Screen</Text>
      <Button
        title="Go To InterestSelectionScreen"
        onPress={() => {
          navigation.navigate('InterestSelection');
          dispatch(setRootScreen('AuthNavigator'));
          dispatch(setAuthScreen('InterestSelection'));
          dispatch(setLoginStatus(false));
        }}
      />
    </SafeAreaView>
  );
};

export default HelpSelectionScreen;