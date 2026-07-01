import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HelpListScreen from '../screens/Dashboard/HelpListScreen';
import TrueEventsScreen from '../screens/Dashboard/TrueEventsScreen';
import SocialScreen from '../screens/Dashboard/SocialScreen';
import ProfileScreen from '../screens/Dashboard/ProfileScreen';
import ChatScreen from '../screens/Dashboard/ChatScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HelpList" component={HelpListScreen} />
      <Tab.Screen name="TrueEvents" component={TrueEventsScreen} />
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;