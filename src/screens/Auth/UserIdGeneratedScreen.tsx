import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../theme/colors';
import CommonButton from '../../components/Button/Button';
import { fetchUserProfileAction } from '../../redux/actions/authActions';

interface UserIdGeneratedScreenProps {
  navigation: any;
}

const UserIdGeneratedScreen: React.FC<UserIdGeneratedScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: any) => state.auth.user);
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) {
      setLoading(true);
      dispatch(fetchUserProfileAction(userId)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId, dispatch]);

  const handleGetStarted = () => navigation.navigate('MainTabNavigator');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.successText}>Success!</Text>
          <Text style={styles.subText}>Your unique Homie ID is ready</Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.avatarWrapper}>
            <Svg height="40" width="40" viewBox="0 0 24 24">
              <Circle cx="12" cy="12" r="11" fill="#2F5E24" />
              <Circle cx="12" cy="8.5" r="3.5" fill="#1E88E5" />
              <Path d="M12 13.5c-3.5 0-6.5 2-6.5 4.5v1h13v-1c0-2.5-3-4.5-6.5-4.5z" fill="#1E88E5" />
            </Svg>
          </View>

          <Text style={styles.memberLabel}>HOMIE MEMBER</Text>
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} style={{ marginBottom: 20 }} />
          ) : (
            <Text style={styles.memberIdText}>{user?.name || 'homie_anonymous'}</Text>
          )}

          <View style={styles.divider} />
          <Text style={styles.statusLabel}>ACCOUNT STATUS</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{user?.isProfileVerified ? 'VERIFIED' : 'PENDING'}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <CommonButton text="Get Started" onPress={handleGetStarted} backgroundColor={colors.primary} textColor={colors.white} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black_1 || '#0A0A0A' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 100, alignItems: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: 30 },
  successText: { fontSize: 36, fontWeight: '700', color: colors.white, marginBottom: 8 },
  subText: { fontSize: 16, color: colors.gray_2 || '#8A8A8E', textAlign: 'center' },
  cardContainer: { width: '100%', backgroundColor: '#151515', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 20, alignItems: 'center' },
  avatarWrapper: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#6D8F3D', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  memberLabel: { fontSize: 11, fontWeight: '600', color: colors.gray_1 || '#555555', letterSpacing: 1.5, marginBottom: 6 },
  memberIdText: { fontSize: 24, fontWeight: '700', color: colors.white, marginBottom: 20 },
  divider: { width: '80%', height: 1, backgroundColor: '#222222', marginBottom: 20 },
  statusLabel: { fontSize: 11, fontWeight: '600', color: colors.gray_1 || '#555555', letterSpacing: 1.5, marginBottom: 8 },
  badgeContainer: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, backgroundColor: '#1A2316', borderWidth: 1, borderColor: '#425430' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#7AA344', letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 25, backgroundColor: 'transparent' },
});

export default UserIdGeneratedScreen;