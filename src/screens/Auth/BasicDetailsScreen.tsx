import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice';
import colors from '../../theme/colors';
import Input from '../../components/Input/Input';
import CommonButton from '../../components/Button/Button';

const AGE_BRACKETS = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

const BasicDetailsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [activeTimeField, setActiveTimeField] = useState<'start' | 'end'>('start');

  const [startHour, setStartHour] = useState(9);
  const [startMinute, setStartMinute] = useState(0);
  const [startAmPm, setStartAmPm] = useState<'AM' | 'PM'>('AM');

  const [endHour, setEndHour] = useState(5);
  const [endMinute, setEndMinute] = useState(0);
  const [endAmPm, setEndAmPm] = useState<'AM' | 'PM'>('PM');

  const [formData, setFormData] = useState({
    age: '',
    city: '',
    state: '',
    country: '',
    mobileNumber: '',
    profession: '',
    workDescription: '',
  });

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const formatDisplayTime = (h: number, m: number, ampm: 'AM' | 'PM') => {
    const hrStr = h < 10 ? `0${h}` : `${h}`;
    const minStr = m < 10 ? `0${m}` : `${m}`;
    return `${hrStr}:${minStr} ${ampm}`;
  };

  const get24Hour = (h: number, ampm: 'AM' | 'PM') => {
    let hour24 = h;
    if (ampm === 'PM' && h !== 12) hour24 += 12;
    if (ampm === 'AM' && h === 12) hour24 = 0;
    return hour24;
  };

  const calculateHours = (): string => {
    const start24 = get24Hour(startHour, startAmPm) + startMinute / 60;
    const end24 = get24Hour(endHour, endAmPm) + endMinute / 60;
    let diff = end24 - start24;
    if (diff < 0) diff += 24;
    return diff.toFixed(1);
  };

  const adjustHour = (amount: number) => {
    if (activeTimeField === 'start') {
      setStartHour((prev) => {
        let next = prev + amount;
        if (next > 12) return 1;
        if (next < 1) return 12;
        return next;
      });
    } else {
      setEndHour((prev) => {
        let next = prev + amount;
        if (next > 12) return 1;
        if (next < 1) return 12;
        return next;
      });
    }
  };

  const adjustMinute = (amount: number) => {
    if (activeTimeField === 'start') {
      setStartMinute((prev) => {
        let next = prev + amount;
        if (next >= 60) return 0;
        if (next < 0) return 45;
        return next;
      });
    } else {
      setEndMinute((prev) => {
        let next = prev + amount;
        if (next >= 60) return 0;
        if (next < 0) return 45;
        return next;
      });
    }
  };

  const toggleAmPm = () => {
    if (activeTimeField === 'start') {
      setStartAmPm((prev) => (prev === 'AM' ? 'PM' : 'AM'));
    } else {
      setEndAmPm((prev) => (prev === 'AM' ? 'PM' : 'AM'));
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      navigation.navigate('FaceVerification');
      dispatch(setRootScreen('AuthNavigator'));
      dispatch(setAuthScreen('FaceVerification'));
      dispatch(setLoginStatus(false));
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const isButtonDisabled = () => {
    if (step === 0) return !formData.age;
    if (step === 1) return !formData.city || !formData.state || !formData.country;
    if (step === 2) return formData.mobileNumber.length !== 10 || !/^\d+$/.test(formData.mobileNumber);
    if (step === 3) return !formData.profession;
    if (step === 5) return !formData.workDescription;
    return false;
  };

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${((step + 1) / 6) * 100}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <View>
            <Text style={styles.title}>What's your age?</Text>
            <Text style={styles.subtitle}>Mandatory: Select your age bracket.</Text>
            <View style={styles.optionsContainer}>
              {AGE_BRACKETS.map((bracket) => {
                const isSelected = formData.age === bracket;
                return (
                  <TouchableOpacity
                    key={bracket}
                    activeOpacity={0.8}
                    onPress={() => updateField('age', bracket)}
                    style={[styles.cardOption, isSelected && styles.cardOptionSelected]}
                  >
                    <Text style={[styles.cardOptionText, isSelected && styles.cardOptionTextSelected]}>
                      {bracket}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.title}>Location Details</Text>
            <Input
              placeholder="City"
              value={formData.city}
              onChangeText={(text) => updateField('city', text)}
              containerStyle={styles.inputSpacing}
            />
            <Input
              placeholder="State"
              value={formData.state}
              onChangeText={(text) => updateField('state', text)}
              containerStyle={styles.inputSpacing}
            />
            <Input
              placeholder="Country"
              value={formData.country}
              onChangeText={(text) => updateField('country', text)}
              containerStyle={styles.inputSpacing}
            />
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.title}>Mobile Number</Text>
            <Input
              type="phone"
              placeholder="10-digit number"
              value={formData.mobileNumber}
              maxLength={10}
              onChangeText={(text) => updateField('mobileNumber', text.replace(/[^0-9]/g, ''))}
              containerStyle={styles.inputSpacing}
            />
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.title}>Profession</Text>
            <Input
              placeholder="Software Engineer, Doctor, etc."
              value={formData.profession}
              onChangeText={(text) => updateField('profession', text)}
              containerStyle={styles.inputSpacing}
            />
          </View>
        )}

        {step === 4 && (
          <View>
            <Text style={styles.title}>Work Timing</Text>
            
            <View style={styles.tabsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setActiveTimeField('start')}
                style={[styles.timeTab, activeTimeField === 'start' && styles.timeTabActive]}
              >
                <Text style={styles.timeLabel}>Start Time</Text>
                <Text style={styles.timeValue}>{formatDisplayTime(startHour, startMinute, startAmPm)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setActiveTimeField('end')}
                style={[styles.timeTab, activeTimeField === 'end' && styles.timeTabActive]}
              >
                <Text style={styles.timeLabel}>End Time</Text>
                <Text style={styles.timeValue}>{formatDisplayTime(endHour, endMinute, endAmPm)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerWidget}>
              <View style={styles.pickerColumn}>
                <TouchableOpacity onPress={() => adjustHour(1)} style={styles.adjustBtn}>
                  <Text style={styles.adjustBtnText}>▲</Text>
                </TouchableOpacity>
                <Text style={styles.pickerNumber}>
                  {activeTimeField === 'start' ? startHour : endHour}
                </Text>
                <TouchableOpacity onPress={() => adjustHour(-1)} style={styles.adjustBtn}>
                  <Text style={styles.adjustBtnText}>▼</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.pickerSeparator}>:</Text>

              <View style={styles.pickerColumn}>
                <TouchableOpacity onPress={() => adjustMinute(15)} style={styles.adjustBtn}>
                  <Text style={styles.adjustBtnText}>▲</Text>
                </TouchableOpacity>
                <Text style={styles.pickerNumber}>
                  {activeTimeField === 'start' 
                    ? (startMinute < 10 ? `0${startMinute}` : startMinute)
                    : (endMinute < 10 ? `0${endMinute}` : endMinute)}
                </Text>
                <TouchableOpacity onPress={() => adjustMinute(-15)} style={styles.adjustBtn}>
                  <Text style={styles.adjustBtnText}>▼</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.pickerColumn}>
                <TouchableOpacity onPress={toggleAmPm} style={styles.ampmBtn}>
                  <Text style={styles.ampmBtnText}>
                    {activeTimeField === 'start' ? startAmPm : endAmPm}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.shiftCalculation}>Total Work Shift: {calculateHours()} hours</Text>
          </View>
        )}

        {step === 5 && (
          <View>
            <Text style={styles.title}>Work Description</Text>
            <Input
              placeholder="Briefly describe what you do..."
              value={formData.workDescription}
              onChangeText={(text) => updateField('workDescription', text)}
              containerStyle={styles.inputSpacing}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <CommonButton
          text={step === 5 ? 'Finish' : 'Continue'}
          onPress={handleNext}
          disabled={isButtonDisabled()}
          backgroundColor={isButtonDisabled() ? '#2E3B1E' : colors.primary}
          textColor={isButtonDisabled() ? '#5A6350' : colors.black}
        />
      </View>
    </SafeAreaView>
  );
};

export default BasicDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black_1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 8,
    marginRight: 12,
  },
  closeText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '300',
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#1C1C1E',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.gray_2,
    fontSize: 16,
    marginBottom: 28,
  },
  optionsContainer: {
    gap: 14,
  },
  cardOption: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#1C1C1E',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
  },
  cardOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#1A2414',
  },
  cardOptionText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '500',
  },
  cardOptionTextSelected: {
    color: colors.primary,
  },
  inputSpacing: {
    marginTop: 12,
    marginBottom: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  timeTab: {
    flex: 1,
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1C1C1E',
  },
  timeTabActive: {
    borderColor: colors.primary,
    backgroundColor: '#1A2414',
  },
  timeLabel: {
    color: '#555559',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  timeValue: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  pickerWidget: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1C1C1E',
    gap: 16,
  },
  pickerColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  adjustBtn: {
    padding: 8,
  },
  adjustBtnText: {
    color: colors.primary,
    fontSize: 18,
  },
  pickerNumber: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '700',
    marginVertical: 4,
  },
  pickerSeparator: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '700',
    bottom: 2,
  },
  ampmBtn: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  ampmBtnText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  shiftCalculation: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.black_1,
  },
});