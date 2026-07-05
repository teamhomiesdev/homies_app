import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice';

const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();

  // Fetching user data from redux store
  const user = useSelector((state: any) => state.auth.user);
  const name = user?.name || '';
  const interests = user?.interests || [];
  const helps = user?.helps || [];

  // Extract first two letters for the avatar display
  const avatarText = name ? name.substring(0, 2).toUpperCase() : '??';

  const handleLogout = async () => {
    dispatch(setRootScreen('AuthNavigator'));
    dispatch(setAuthScreen('Login'));
    dispatch(setLoginStatus(false));
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthNavigator' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Row with Logout Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar Circle */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{avatarText}</Text>
        </View>

        {/* Profile Username with @ handle prefix */}
        <Text style={styles.profileName}>@{name}</Text>

        {/* Interests Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Interests</Text>
            {/* Optional Edit Button placeholder as per UI icon */}
            <TouchableOpacity onPress={() => {
              navigation.navigate('InterestSelection', { from: 'Profile' });
            }}>
              <Text style={styles.editIconText}>✎</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagContainer}>
            {interests.map((interest: string, index: number) => (
              <View key={`interest-${index}`} style={styles.tag}>
                <Text style={styles.tagText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Helps Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Helps</Text>
            <TouchableOpacity onPress={() => {
              navigation.navigate('HelpSelection', { from: 'Profile' });
            }}>
              <Text style={styles.editIconText}>✎</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagContainer}>
            {helps.map((help: string, index: number) => (
              <View key={`help-${index}`} style={styles.tag}>
                <Text style={styles.tagText}>{help}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0E', // Matching dark aesthetic in the reference picture
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  logoutButton: {
    backgroundColor: '#2A1415', // Dark red background tint
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4A1D20',
  },
  logoutText: {
    color: '#E53E3E', // Sharp red text
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  avatarContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#4F6F46', // Olive/muted green border match
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  avatarText: {
    color: colors.white || '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  profileName: {
    color: colors.white || '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 25,
    marginBottom: 40,
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 35,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: colors.white || '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  editIconText: {
    color: '#4F6F46', // Matching olive edit icon color
    fontSize: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tag: {
    backgroundColor: '#171715', // Subtle dark contrasting tag blocks
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#262622',
  },
  tagText: {
    color: '#5C7A52', // Muted green text for the inner tags
    fontSize: 15,
    fontWeight: '600',
  },
});