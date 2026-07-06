import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileFieldsAction, fetchUserProfileAction } from '../../redux/actions/authActions';
import colors from '../../theme/colors';
import CommonButton from '../../components/Button/Button';
import { getHelpsApi } from '../../services/authService';

interface HelpItem { id: string; help: string; }

const HelpSelectionScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch<any>();
  const isFromProfile = route.params?.from === 'Profile';
  const user = useSelector((state: any) => state.auth.user);
  const userId = user?._id || user?.id;

  const [categories, setCategories] = useState<HelpItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const initializeScreenData = async () => {
      try {
        setLoading(true);
        const optionsResponse = await getHelpsApi();
        if (optionsResponse?.success && optionsResponse.data?.helps) {
          setCategories(optionsResponse.data.helps);
          if (userId) {
            const profileResult = await dispatch(fetchUserProfileAction(userId));
            if (profileResult?.success && profileResult.data?.helps) {
              const savedHelps: string[] = profileResult.data.helps;
              const preSelected = optionsResponse.data.helps
                .map((item: HelpItem) => item.help)
                .filter((helpText: string) => savedHelps.includes(helpText));
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
    const result = await dispatch(updateProfileFieldsAction({ helps: selectedItems }));
    setIsSaving(false);
    if (result?.success) {
      isFromProfile ? navigation.goBack() : navigation.navigate('InterestSelection');
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
          <Text style={styles.headerText}>How Can We{'\n'}Help You?</Text>
          <Text style={styles.subHeaderText}>Select one or more areas where you are seeking assistance.</Text>
          <View style={styles.tagContainer}>
            {categories.map(item => (
              <TouchableOpacity key={item.id} onPress={() => toggleSelection(item.help)} style={[styles.tag, selectedItems.includes(item.help) && styles.tagSelected]}>
                <Text style={[styles.tagText, selectedItems.includes(item.help) && styles.tagTextSelected]}>{item.help}</Text>
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

export default HelpSelectionScreen;