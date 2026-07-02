import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HelpListScreen from '../screens/Dashboard/HelpListScreen';
import TrueEventsScreen from '../screens/Dashboard/TrueEventsScreen';
import SocialScreen from '../screens/Dashboard/SocialScreen';
import ProfileScreen from '../screens/Dashboard/ProfileScreen';
import ChatScreen from '../screens/Dashboard/ChatScreen';

import colors from '../theme/colors';

import Group from '../assets/svg/group.svg';
import Book from '../assets/svg/book.svg';
import Hands from '../assets/svg/hands.svg';
import User from '../assets/svg/user.svg';
import Chat from '../assets/svg/chat.svg';
import Group_Inactive from '../assets/svg/group_inactive.svg';
import Book_Inactive from '../assets/svg/book_inactive.svg';
import Hands_Inactive from '../assets/svg/hands_inactive.svg';
import User_Inactive from '../assets/svg/user_inactive.svg';
import Chat_Inactive from '../assets/svg/chat_inactive.svg';

const Tab = createBottomTabNavigator();

// Custom layout wrapper for the center "Social" button to make it float/overlap cleanly
const CustomTabBarButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={styles.centerButtonWrapper}
  >
    <View style={styles.centerButtonInner}>{children}</View>
  </TouchableOpacity>
);

const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="HelpList"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 65 + insets.bottom,
            paddingBottom: insets.bottom,
          },
        ],
      }}
    >
      <Tab.Screen
        name="Social"
        component={SocialScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <Group height={30} width={30} />
              ) : (
                <Group_Inactive height={24} width={24} />
              )}
            </>
          ),
        }}
      />

      <Tab.Screen
        name="TrueEvents"
        component={TrueEventsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <Book height={30} width={30} />
              ) : (
                <Book_Inactive height={24} width={24} />
              )}
            </>
          ),
        }}
      />

      <Tab.Screen
        name="HelpList"
        component={HelpListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <Hands height={35} width={35} />
              ) : (
                <Hands_Inactive height={24} width={24} />
              )}
            </>
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <User height={30} width={30} />
              ) : (
                <User_Inactive height={24} width={24} />
              )}
            </>
          ),
        }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <Chat height={30} width={30} />
              ) : (
                <Chat_Inactive height={24} width={24} />
              )}
            </>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: '#0F0F0F', // Matches the distinct dark grey bar container fill color
    borderTopWidth: 0,
    elevation: 0,
    // Top corner rounding architecture matching the design
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    // Eliminates standard tab borders cleanly
    shadowColor: 'transparent',
  },
  centerButtonWrapper: {
    top: -24, // Pulls the center container up over the tab bar ceiling line
    justifyContent: 'center',
    alignItems: 'center',
    width: 74,
    height: 74,
  },
  centerButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#080808', // Super dark inside base circle matching image
    borderWidth: 3,
    borderColor: '#181818', // Inner dark contrast ring outline
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
