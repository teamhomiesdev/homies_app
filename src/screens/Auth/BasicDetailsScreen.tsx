import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../theme/colors';
import Input from '../../components/Input/Input';
import CommonButton from '../../components/Button/Button';

// Import our custom action thunk and custom toast notifier
import { registerAction } from '../../redux/actions/authActions';
import { showToast } from '../../components/Toast/Toast';

const AGE_BRACKETS = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

const BasicDetailsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<any>();

  // Extract cached google profile details from store
  const googleProfileCache = useSelector(
    (state: any) => state.auth.googleProfileCache,
  );

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTimeField, setActiveTimeField] = useState<'start' | 'end'>(
    'start',
  );

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

  // Dynamic state verification logic checking fields before letting users advance
  const isButtonDisabled = () => {
    if (step === 0) return !formData.age;
    if (step === 1)
      return !formData.city || !formData.state || !formData.country;
    if (step === 2)
      return !formData.mobileNumber || formData.mobileNumber.length < 10;
    if (step === 3) return !formData.profession;
    if (step === 4) return false; // Time selector wizard step is prefilled by default state values
    if (step === 5) return !formData.workDescription;
    return false;
  };

  // Helper date assembly logic to format a valid ISO Date string
  const generateIsoTimestamp = (
    hour: number,
    minute: number,
    ampm: 'AM' | 'PM',
  ) => {
    let hr24 = hour;
    if (ampm === 'PM' && hour !== 12) hr24 += 12;
    if (ampm === 'AM' && hour === 12) hr24 = 0;

    const targetDate = new Date();
    targetDate.setHours(hr24, minute, 0, 0);
    return targetDate.toISOString();
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const payload = {
          email: googleProfileCache?.email || 'teamhomiesdev@mailinator.com',
          platform: 'google',
          firstName: googleProfileCache?.firstName || 'Vasanth',
          dob: '2008-03-11T06:35:00.000Z', // Static requirement placeholder
          city: formData.city,
          state: formData.state,
          country: formData.country,
          mobileNumber: formData.mobileNumber,
          profession: formData.profession,
          workTiming: generateIsoTimestamp(startHour, startMinute, startAmPm),
          typeOfWork: formData.workDescription,
        };

        const result = await dispatch(registerAction(payload));
        setLoading(false);

        if (result.success) {
          showToast(
            'Basic details completed! Registration successful.',
            'success',
            3000,
          );
          navigation.navigate(result.targetScreen);
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          showToast(
            result.error || 'Failed to complete registration onboarding.',
            'error',
          );
        }
      } catch (err: any) {
        setLoading(false);
        showToast(
          err.message || 'An unexpected networking problem occurred.',
          'error',
        );
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const adjustHour = (type: 'up' | 'down') => {
    if (activeTimeField === 'start') {
      setStartHour(prev =>
        type === 'up'
          ? prev === 12
            ? 1
            : prev + 1
          : prev === 1
          ? 12
          : prev - 1,
      );
    } else {
      setEndHour(prev =>
        type === 'up'
          ? prev === 12
            ? 1
            : prev + 1
          : prev === 1
          ? 12
          : prev - 1,
      );
    }
  };

  const adjustMinute = (type: 'up' | 'down') => {
    if (activeTimeField === 'start') {
      setStartMinute(prev =>
        type === 'up'
          ? prev === 59
            ? 0
            : prev + 1
          : prev === 0
          ? 59
          : prev - 1,
      );
    } else {
      setEndMinute(prev =>
        type === 'up'
          ? prev === 59
            ? 0
            : prev + 1
          : prev === 0
          ? 59
          : prev - 1,
      );
    }
  };

  const toggleAmPm = () => {
    if (activeTimeField === 'start') {
      setStartAmPm(prev => (prev === 'AM' ? 'PM' : 'AM'));
    } else {
      setEndAmPm(prev => (prev === 'AM' ? 'PM' : 'AM'));
    }
  };

  const currentHour = activeTimeField === 'start' ? startHour : endHour;
  const currentMinute = activeTimeField === 'start' ? startMinute : endMinute;
  const currentAmPm = activeTimeField === 'start' ? startAmPm : endAmPm;

  return (
    <SafeAreaView
      edges={['top', 'bottom', 'left', 'right']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header Container */}
        <View style={styles.header}>
          {step > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          )}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${((step + 1) / 6) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.stepIndicator}>{step + 1}/6</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 0 && (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>What's your age bracket?</Text>
              <Text style={styles.subtitle}>
                This helps us customize your ecosystem view.
              </Text>
              <View style={styles.ageGrid}>
                {AGE_BRACKETS.map(item => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.ageCard,
                      formData.age === item && styles.ageCardActive,
                    ]}
                    onPress={() => setFormData({ ...formData, age: item })}
                  >
                    <Text
                      style={[
                        styles.ageText,
                        formData.age === item && styles.ageTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>Where are you located?</Text>
              <Text style={styles.subtitle}>
                Please provide your residential region attributes.
              </Text>
              <Input
                placeholder="Country"
                value={formData.country}
                onChangeText={text => setFormData({ ...formData, country: text })}
                containerStyle={styles.inputMargin}
              />
              <Input
                placeholder="State"
                value={formData.state}
                onChangeText={text => setFormData({ ...formData, state: text })}
                containerStyle={styles.inputMargin}
              />
              <Input
                placeholder="City"
                value={formData.city}
                onChangeText={text => setFormData({ ...formData, city: text })}
                containerStyle={styles.inputMargin}
              />
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>What's your mobile number?</Text>
              <Text style={styles.subtitle}>
                Used securely to safeguard account operations.
              </Text>
              <Input
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                keyboardType="phone-pad"
                maxLength={10}
                onChangeText={text => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, mobileNumber: numericText });
                }}
                containerStyle={styles.inputMargin}
              />
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>What is your profession?</Text>
              <Text style={styles.subtitle}>
                Let our network entities know what your job area is.
              </Text>
              <Input
                placeholder="Profession"
                value={formData.profession}
                onChangeText={text =>
                  setFormData({ ...formData, profession: text })
                }
                containerStyle={styles.inputMargin}
              />
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>Select your work timing</Text>
              <Text style={styles.subtitle}>
                Configure active time boundaries for your availability.
              </Text>

              <View style={styles.timeTabsRow}>
                <TouchableOpacity
                  style={[
                    styles.timeTab,
                    activeTimeField === 'start' && styles.timeTabActive,
                  ]}
                  onPress={() => setActiveTimeField('start')}
                >
                  <Text style={styles.timeLabel}>Start Time</Text>
                  <Text style={styles.timeValue}>
                    {String(startHour).padStart(2, '0')}:
                    {String(startMinute).padStart(2, '0')} {startAmPm}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.timeTab,
                    activeTimeField === 'end' && styles.timeTabActive,
                  ]}
                  onPress={() => setActiveTimeField('end')}
                >
                  <Text style={styles.timeLabel}>End Time</Text>
                  <Text style={styles.timeValue}>
                    {String(endHour).padStart(2, '0')}:
                    {String(endMinute).padStart(2, '0')} {endAmPm}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Time Picker Controls Widget */}
              <View style={styles.pickerWidget}>
                <View style={styles.pickerColumn}>
                  <TouchableOpacity
                    style={styles.adjustBtn}
                    onPress={() => adjustHour('up')}
                  >
                    <Text style={styles.adjustBtnText}>▲</Text>
                  </TouchableOpacity>
                  <Text style={styles.pickerNumber}>
                    {String(currentHour).padStart(2, '0')}
                  </Text>
                  <TouchableOpacity
                    style={styles.adjustBtn}
                    onPress={() => adjustHour('down')}
                  >
                    <Text style={styles.adjustBtnText}>▼</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.pickerSeparator}>:</Text>

                <View style={styles.pickerColumn}>
                  <TouchableOpacity
                    style={styles.adjustBtn}
                    onPress={() => adjustMinute('up')}
                  >
                    <Text style={styles.adjustBtnText}>▲</Text>
                  </TouchableOpacity>
                  <Text style={styles.pickerNumber}>
                    {String(currentMinute).padStart(2, '0')}
                  </Text>
                  <TouchableOpacity
                    style={styles.adjustBtn}
                    onPress={() => adjustMinute('down')}
                  >
                    <Text style={styles.adjustBtnText}>▼</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.pickerColumn}>
                  <TouchableOpacity style={styles.ampmBtn} onPress={toggleAmPm}>
                    <Text style={styles.ampmBtnText}>{currentAmPm}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {step === 5 && (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>Describe your type of work</Text>
              <Text style={styles.subtitle}>
                Provide a short description of what you do daily.
              </Text>
              <Input
                placeholder="Type of work description..."
                value={formData.workDescription}
                onChangeText={text =>
                  setFormData({ ...formData, workDescription: text })
                }
                multiline={true}
              />
            </View>
          )}
        </ScrollView>

        {/* Footer Action Bar */}
        <View style={styles.footer}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <CommonButton
              text={step === 5 ? 'Finish' : 'Continue'}
              onPress={handleNext}
              disabled={isButtonDisabled()}
              backgroundColor={isButtonDisabled() ? '#2E3B1E' : colors.primary}
              textColor={isButtonDisabled() ? '#5A6350' : colors.black}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BasicDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  backButton: {
    paddingRight: 4,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: '#1C1C1E',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepIndicator: {
    color: colors.gray_2,
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  stepContainer: {
    flex: 1,
  },
  title: {
    color: colors.white,
    fontSize: 20, // Noticeably smaller layout presence
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: 4,
  },
  subtitle: {
    color: colors.gray_2,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, 
  },
  ageCard: {
    width: '48%',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#1C1C1E',
    borderRadius: 8,
    paddingVertical: 10, // Drastically reduced from 15/24 to maximize layout layout space
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#1A2414',
  },
  ageText: {
    color: colors.gray_2,
    fontSize: 14, 
    fontWeight: '600',
  },
  ageTextActive: {
    color: colors.primary,
  },
  inputMargin: {
    marginBottom: 10,
  },
  timeTabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  timeTab: {
    flex: 1,
    backgroundColor: '#121212',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1C1C1E',
  },
  timeTabActive: {
    borderColor: colors.primary,
    backgroundColor: '#1A2414',
  },
  timeLabel: {
    color: '#555559',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  timeValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  pickerWidget: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1C1C1E',
    gap: 10,
  },
  pickerColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
  },
  adjustBtn: {
    padding: 4,
  },
  adjustBtnText: {
    color: colors.primary,
    fontSize: 14,
  },
  pickerNumber: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 2,
  },
  pickerSeparator: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  ampmBtn: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  ampmBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1C1C1E',
    backgroundColor: colors.black,
  },
});