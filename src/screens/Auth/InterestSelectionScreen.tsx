import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthScreen, setLoginStatus, setRootScreen } from '../../redux/slices/authSlice';
import { updateProfileFieldsAction, fetchUserProfileAction } from '../../redux/actions/authActions';
import colors from '../../theme/colors';
import CommonButton from '../../components/Button/Button';
import { getInterestsApi } from '../../services/authService';

interface InterestItem { id: string; interest: string; }

const InterestSelectionScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch<any>();
  const isFromProfile = route.params?.from === 'Profile';
  const user = useSelector((state: any) => state.auth.user);
  const userId = user?._id || user?.id;

  const [specializations, setSpecializations] = useState<InterestItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const initializeScreenData = async () => {
      try {
        setLoading(true);
        const optionsResponse = await getInterestsApi();
        if (optionsResponse?.success && optionsResponse.data?.interests) {
          setSpecializations(optionsResponse.data.interests);
          if (userId) {
            const profileResult = await dispatch(fetchUserProfileAction(userId));
            if (profileResult?.success && profileResult.data?.interests) {
              const savedInterests: string[] = profileResult.data.interests;
              const preSelected = optionsResponse.data.interests
                .map((item: InterestItem) => item.interest)
                .filter((i: string) => savedInterests.includes(i));
              setSelectedItems(preSelected);
            }
          }
        }
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Could not connect.');
      } finally {
        setLoading(false);
      }
    };
    initializeScreenData();
  }, [userId, dispatch]);

  const toggleSelection = (item: string) => {
    setSelectedItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleContinue = async () => {
    setIsSaving(true);
    const result = await dispatch(updateProfileFieldsAction({ interests: selectedItems }));
    setIsSaving(false);
    if (result?.success) {
      if (isFromProfile) {
        navigation.goBack();
      } else {
        navigation.navigate('UserIdGenerated');
        dispatch(setRootScreen('MainTabNavigator'));
        dispatch(setAuthScreen('Login'));
        dispatch(setLoginStatus(true));
      }
    } else {
      Alert.alert('Update Failed', result?.error || 'Unable to update.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.centeredLoader}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.headerText}>Your{'\n'}Specialization</Text>
          <Text style={styles.subHeaderText}>Please select your fields of expertise.</Text>
          <View style={styles.tagContainer}>
            {specializations.map(item => (
              <TouchableOpacity key={item.id} onPress={() => toggleSelection(item.interest)} style={[styles.tag, selectedItems.includes(item.interest) && styles.tagSelected]}>
                <Text style={[styles.tagText, selectedItems.includes(item.interest) && styles.tagTextSelected]}>{item.interest}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      {!loading && (
        <View style={styles.footer}>
          <CommonButton text={isSaving ? 'Saving...' : 'Continue'} onPress={handleContinue} disabled={selectedItems.length === 0 || isSaving} backgroundColor={colors.primary} textColor={colors.white} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black_1 || '#0A0A0A' },
  centeredLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 120 },
  headerText: { fontSize: 36, fontWeight: '700', color: colors.white, marginBottom: 20 },
  subHeaderText: { fontSize: 16, color: colors.gray_2 || '#8A8A8E', marginBottom: 30 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { backgroundColor: colors.gray_4 || '#2C2C2C', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, marginRight: 10, marginBottom: 10 },
  tagSelected: { backgroundColor: '#1C2814', borderColor: colors.primary, borderWidth: 1 },
  tagText: { color: colors.gray_2 || '#8A8A8E', fontSize: 14 },
  tagTextSelected: { color: colors.white },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 25, paddingTop: 10, backgroundColor: '#0A0A0A' },
});

export default InterestSelectionScreen;