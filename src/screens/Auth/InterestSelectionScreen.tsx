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
import { useDispatch, useSelector } from 'react-redux'; // Added useSelector[cite: 5]
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice'; //[cite: 5]

import colors from '../../theme/colors'; //[cite: 5]
import CommonButton from '../../components/Button/Button'; //[cite: 5]
import { getInterestsApi } from '../../services/authService'; //[cite: 5]
import { updateProfileFieldsAction, fetchUserProfileAction } from '../../redux/actions/authActions'; // Added fetchUserProfileAction[cite: 5]

interface InterestItem {
  id: string;
  interest: string;
} //[cite: 5]

const InterestSelectionScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<any>();

  // Extract userId to dynamically request the logged-in user's profile
  const user = useSelector((state: any) => state.auth.user);
  const userId = user?._id || user?.id;

  const [specializations, setSpecializations] = useState<InterestItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false); //[cite: 5]

  useEffect(() => {
    const initializeScreenData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch available interests master list from options API
        const optionsResponse = await getInterestsApi();
        let fetchedInterests: InterestItem[] = [];

        if (optionsResponse && optionsResponse.success && optionsResponse.data?.interests) {
          fetchedInterests = optionsResponse.data.interests;
          setSpecializations(fetchedInterests);
        } else {
          Alert.alert('Error', 'Failed to retrieve interests options list.');
          return;
        }

        // 2. Fetch the user profile to cross-reference pre-selections
        if (userId) {
          const profileResult = await dispatch(fetchUserProfileAction(userId));
          if (profileResult && profileResult.success && profileResult.data?.interests) {
            const savedInterests: string[] = profileResult.data.interests;

            // Map saved string values to confirm they exist in options before selection
            const preSelected = fetchedInterests
              .map(item => item.interest)
              .filter(interestText => savedInterests.includes(interestText));

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
  }, [userId, dispatch]); //[cite: 5]

  const toggleSelection = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  }; //[cite: 5]

  const handleContinue = async () => {
    try {
      setIsSaving(true); //[cite: 5]
      const result = await dispatch(
        updateProfileFieldsAction({ interests: selectedItems }),
      ); //[cite: 5]

      if (result && result.success) {
        navigation.navigate('UserIdGenerated'); //[cite: 5]
        dispatch(setRootScreen('MainTabNavigator')); //[cite: 5]
        dispatch(setAuthScreen('Login')); //[cite: 5]
        dispatch(setLoginStatus(true)); //[cite: 5]
      } else {
        Alert.alert(
          'Update Failed',
          result.error || 'Unable to update configuration settings.',
        ); //[cite: 5]
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Something went wrong.'); //[cite: 5]
    } finally {
      setIsSaving(false); //[cite: 5]
    }
  }; //[cite: 5]

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
          <Text style={styles.headerText}>Your{'\n'}Specialization</Text>
          <Text style={styles.subHeaderText}>
            Please select one or more fields of expertise to build your profile.
          </Text>

          <View style={styles.tagContainer}>
            {specializations.map(item => {
              const isSelected = selectedItems.includes(item.interest);
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => toggleSelection(item.interest)}
                  disabled={isSaving}
                  style={[styles.tag, isSelected && styles.tagSelected]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      isSelected && styles.tagTextSelected,
                    ]}
                  >
                    {item.interest}
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

export default InterestSelectionScreen;

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