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

// Importing your custom colors and common button
import colors from '../../theme/colors';
import CommonButton from '../../components/Button/Button'; // Double check this path matches your folder structure

const CATEGORIES = [
  'Auto mobile',
  'Career guidance',
  'Entertainment',
  'Fashion',
  'Finance',
  'Fitness',
  'Health',
  'Investment',
  'Legel', // Kept typo from image ("Legel")
  'Mental health',
  'Nutrition',
  'Relation ship', // Kept spacing from image ("Relation ship")
];

const HelpSelectionScreen = ({ navigation }: any) => {
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
    // Navigate and trigger redux actions
    navigation.navigate('InterestSelection');
    dispatch(setRootScreen('AuthNavigator'));
    dispatch(setAuthScreen('InterestSelection'));
    dispatch(setLoginStatus(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Text style={styles.headerText}>How Can We{"\n"}Help You?</Text>
        
        <Text style={styles.subHeaderText}>
          Select one or more areas where you are seeking assistance to personalize your journey.
        </Text>

        {/* Tags Wrap Layout Section */}
        <View style={styles.tagContainer}>
          {CATEGORIES.map((category) => {
            const isSelected = selectedItems.includes(category);
            return (
              <TouchableOpacity
                key={category}
                activeOpacity={0.7}
                onPress={() => toggleSelection(category)}
                style={[
                  styles.tag,
                  isSelected && styles.tagSelected
                ]}
              >
                <Text style={[
                  styles.tagText,
                  isSelected && styles.tagTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Persistent Bottom Action Button */}
      <View style={styles.footer}>
        <CommonButton
          text="Continue"
          onPress={handleContinue}
          disabled={selectedItems.length === 0} // Optional: disables button if nothing is chosen
          backgroundColor={colors.primary}
          textColor={colors.white}
        />
      </View>
    </SafeAreaView>
  );
};

export default HelpSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black_1 || '#0A0A0A', // Falls back to dark background if colors file doesn't match
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
    paddingBottom: 34, // Safe spacing for modern bezel-less device home bars
    backgroundColor: 'transparent',
  },
});