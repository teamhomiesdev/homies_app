import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

// Referencing your core theme configuration and button
import colors from '../../theme/colors';
import CommonButton from '../../components/Button/Button';

interface UserIdGeneratedScreenProps {
  navigation: any;
}

const UserIdGeneratedScreen: React.FC<UserIdGeneratedScreenProps> = ({ navigation }) => {
  
  const handleGetStarted = () => {
    // Navigate further into the app dashboard/home setup
    navigation.navigate('MainTabNavigator');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header Message */}
        <View style={styles.headerContainer}>
          <Text style={styles.successText}>Success!</Text>
          <Text style={styles.subText}>Your unique Homie ID is ready</Text>
        </View>

        {/* Profile Card Container */}
        <View style={styles.cardContainer}>
          
          {/* Avatar Area */}
          <View style={styles.avatarWrapper}>
            <Svg height="60" width="60" viewBox="0 0 24 24">
              <Circle cx="12" cy="12" r="11" fill="#2F5E24" />
              {/* Head */}
              <Circle cx="12" cy="8.5" r="3.5" fill="#1E88E5" />
              {/* Torso */}
              <Path 
                d="M12 13.5c-3.5 0-6.5 2-6.5 4.5v1h13v-1c0-2.5-3-4.5-6.5-4.5z" 
                fill="#1E88E5" 
              />
            </Svg>
          </View>

          {/* Member Label & ID */}
          <Text style={styles.memberLabel}>HOMIE MEMBER</Text>
          <Text style={styles.memberIdText}>homie_c633lyka0</Text>
          
          {/* Divider Line */}
          <View style={styles.divider} />

          {/* Account Status Badge Label */}
          <Text style={styles.statusLabel}>ACCOUNT STATUS</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>VERIFIED</Text>
          </View>

        </View>
      </ScrollView>

      {/* Floating Bottom Navigation Trigger */}
      <View style={styles.footer}>
        <CommonButton
          text="Get Started"
          onPress={handleGetStarted}
          backgroundColor={colors.primary}
          textColor={colors.white}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserIdGeneratedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black_1 || '#0A0A0A',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successText: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 18,
    color: colors.gray_2 || '#8A8A8E',
    textAlign: 'center',
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#151515', // Darker offset sheet container color matching your image layout
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#222222',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3, // Soft backdrop elevation depth context
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6D8F3D', // Outer ring background layer matching profile circle asset
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  memberLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray_1 || '#555555',
    letterSpacing: 2,
    marginBottom: 8,
  },
  memberIdText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 30,
  },
  divider: {
    width: '85%',
    height: 1,
    backgroundColor: '#222222',
    marginBottom: 26,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray_1 || '#555555',
    letterSpacing: 2,
    marginBottom: 12,
  },
  badgeContainer: {
    borderWidth: 1.5,
    borderColor: '#425430', // Forest green capsule perimeter variant style
    backgroundColor: '#1A2316',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7AA344', // Distinct glowing green verification typography accent
    letterSpacing: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 34,
    backgroundColor: 'transparent',
  },
});