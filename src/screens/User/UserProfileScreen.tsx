import React from 'react';
import { Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UserProfileScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Profile Screen</Text>
      <Button
        title="Go To Login"
        onPress={() => navigation.navigate("AuthNavigator")}
      />
    </SafeAreaView>
  );
};

export default UserProfileScreen;
