import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice';

// Referencing your core theme configuration
import colors from '../../theme/colors';
import CommonButton from '../../components/Button/Button';

const SPECIALIZATIONS = [
  'Auto mobile',
  'Career guidance',
  'Entertainment',
  'Fashion',
  'Finance',
  'Fitness',
  'Health',
  'Investment',
  'Legel', 
  'Mental health',
  'Nutrition',
  'Relation ship',
];

const InterestSelectionScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Toggle selection state for tags
  const toggleSelection = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleContinue = () => {
    navigation.navigate("UserIdGenerated");
    dispatch(setRootScreen('MainTabNavigator'));
    dispatch(setAuthScreen('Login'));
    dispatch(setLoginStatus(true));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title Section */}
        <Text style={styles.headerText}>Your{"\n"}Specialization</Text>
        
        <Text style={styles.subHeaderText}>
          Please select one or more fields of expertise to build your profile.
        </Text>

        {/* Dynamic Flow Wrapping Tag Cloud Container */}
        <View style={styles.tagContainer}>
          {SPECIALIZATIONS.map((item) => {
            const isSelected = selectedItems.includes(item);
            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.7}
                onPress={() => toggleSelection(item)}
                style={[
                  styles.tag,
                  isSelected && styles.tagSelected
                ]}
              >
                <Text style={[
                  styles.tagText,
                  isSelected && styles.tagTextSelected
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Bottom Action Sheet View */}
      <View style={styles.footer}>
        <CommonButton
          text="Continue"
          onPress={handleContinue}
          disabled={selectedItems.length === 0}
          backgroundColor={colors.primary}
          textColor={colors.white}
        />
      </View>
    </SafeAreaView>
  );
};

export default InterestSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black_1 || '#0A0A0A',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 100, // Safe padding space so elements don't get trapped under the absolute footer
  },
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
  tagSelected: {
    borderColor: colors.primary, // Highlights border with your theme primary color when tapped
    backgroundColor: '#1C2814', // Subtle darkened primary tint for selection context
  },
  tagText: {
    color: colors.gray_2 || '#8A8A8E',
    fontSize: 16,
    fontWeight: '500',
  },
  tagTextSelected: {
    color: colors.white,
    fontWeight: '600',
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