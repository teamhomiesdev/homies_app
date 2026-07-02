import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux'; // Added useSelector[cite: 4]
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice'; //[cite: 4]

import colors from '../../theme/colors'; //[cite: 4]
import CommonButton from '../../components/Button/Button'; //[cite: 4]
import { getHelpsApi } from '../../services/authService'; //[cite: 4]
import {
  updateProfileFieldsAction,
  fetchUserProfileAction,
} from '../../redux/actions/authActions'; // Added fetchUserProfileAction[cite: 4]

interface HelpItem {
  id: string;
  help: string;
} //[cite: 4]

const HelpSelectionScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<any>();

  // Extract userId to dynamically request the logged-in user's profile
  const user = useSelector((state: any) => state.auth.user);
  const userId = user?._id || user?.id;

  const [categories, setCategories] = useState<HelpItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false); //[cite: 4]

  useEffect(() => {
    const initializeScreenData = async () => {
      try {
        setLoading(true);

        // 1. Fetch available help master list from options API
        const optionsResponse = await getHelpsApi();
        let fetchedCategories: HelpItem[] = [];

        if (
          optionsResponse &&
          optionsResponse.success &&
          optionsResponse.data?.helps
        ) {
          fetchedCategories = optionsResponse.data.helps;
          setCategories(fetchedCategories);
        } else {
          Alert.alert('Error', 'Failed to retrieve help list options.');
          return;
        }

        // 2. Fetch the user profile to cross-reference pre-selections
        if (userId) {
          const profileResult = await dispatch(fetchUserProfileAction(userId));
          if (
            profileResult &&
            profileResult.success &&
            profileResult.data?.helps
          ) {
            const savedHelps: string[] = profileResult.data.helps;

            // Map saved string values to confirm they exist in options before selection
            const preSelected = fetchedCategories
              .map(item => item.help)
              .filter(helpText => savedHelps.includes(helpText));

            setSelectedItems(preSelected);
          }
        }
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Could not connect to service.');
      } finally {
        setLoading(false);
      }
    };

    initializeScreenData();
  }, [userId, dispatch]); //[cite: 4]

  const toggleSelection = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  }; //[cite: 4]

  const handleContinue = async () => {
    try {
      setIsSaving(true); //[cite: 4]
      const result = await dispatch(
        updateProfileFieldsAction({ helps: selectedItems }),
      ); //[cite: 4]

      if (result && result.success) {
        navigation.navigate('InterestSelection'); //[cite: 4]
      } else {
        Alert.alert(
          'Update Failed',
          result.error || 'Unable to update selections.',
        ); //[cite: 4]
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Something went wrong.'); //[cite: 4]
    } finally {
      setIsSaving(false); //[cite: 4]
    }
  }; //[cite: 4]

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.centeredLoader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.headerText}>How Can We{'\n'}Help You?</Text>
          <Text style={styles.subHeaderText}>
            Select one or more areas where you are seeking assistance to
            personalize your journey.
          </Text>

          <View style={styles.tagContainer}>
            {categories.map(item => {
              const isSelected = selectedItems.includes(item.help);
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => toggleSelection(item.help)}
                  disabled={isSaving}
                  style={[styles.tag, isSelected && styles.tagSelected]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      isSelected && styles.tagTextSelected,
                    ]}
                  >
                    {item.help}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {!loading && (
        <View style={styles.footer}>
          <CommonButton
            text={isSaving ? 'Saving...' : 'Continue'}
            onPress={handleContinue}
            disabled={selectedItems.length === 0 || isSaving}
            backgroundColor={colors.primary}
            textColor={colors.white}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HelpSelectionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black_1 || '#0A0A0A' },
  centeredLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 100 },
  headerText: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 50,
    marginBottom: 20,
  },
  subHeaderText: {
    fontSize: 18,
    color: colors.gray_2 || '#8A8A8E',
    lineHeight: 26,
    marginBottom: 40,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  tag: {
    backgroundColor: colors.gray_4 || '#2C2C2C',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 18,
    marginRight: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagSelected: { borderColor: colors.primary, backgroundColor: '#1C2814' },
  tagText: {
    color: colors.gray_2 || '#8A8A8E',
    fontSize: 16,
    fontWeight: '500',
  },
  tagTextSelected: { color: colors.white, fontWeight: '600' },
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
