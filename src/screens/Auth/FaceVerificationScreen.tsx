import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import colors from '../../theme/colors';
import CommonButton from '../../components/Button/Button';

import { useDispatch, useSelector } from 'react-redux';
import {
  setRootScreen,
  setAuthScreen,
  setLoginStatus,
} from '../../redux/slices/authSlice';
import {
  verifyFaceImage,
  updateVerificationStatus,
} from '../../services/authService';
import { showToast } from '../../components/Toast/Toast';

interface FaceVerificationScreenProps {
  navigation: {
    navigate: (screenName: string) => void;
  };
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOX_WIDTH = SCREEN_WIDTH - 48;
const BOX_HEIGHT = BOX_WIDTH * 1.25;

const FaceVerificationScreen: React.FC<FaceVerificationScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const userId = user?._id || user?.id;
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const photoOutput = usePhotoOutput();

  // Animation value for the laser scanner line
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const scanLoop = useRef<Animated.CompositeAnimation | null>(null);

  // Trigger scanning line animation whenever a capture holds the frame
  useEffect(() => {
    if (isCapturing && base64Image) {
      scanAnimation.setValue(0);
      
      // Infinite up & down sequence
      scanLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnimation, {
            toValue: BOX_HEIGHT - 4, // Stop right at the bottom edge
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnimation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      scanLoop.current.start();
    } else {
      if (scanLoop.current) {
        scanLoop.current.stop();
      }
      scanAnimation.setValue(0);
    }

    return () => {
      if (scanLoop.current) scanLoop.current.stop();
    };
  }, [isCapturing, base64Image]);

  const handleEnableCamera = async () => {
    const granted = await requestPermission();
    if (!granted) {
      Alert.alert(
        'Permission Denied',
        'Please allow camera permission from Settings.',
      );
    }
  };

  const convertUriToBase64 = (fileUri: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const fullDataUrl = reader.result as string;
          const rawBase64 = fullDataUrl.split(',')[1] || fullDataUrl;
          resolve(rawBase64);
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = error => reject(error);

      const safeUri = fileUri.startsWith('file://')
        ? fileUri
        : `file://${fileUri}`;
      xhr.open('GET', safeUri);
      xhr.responseType = 'blob';
      xhr.send();
    });
  };

  const executeFaceVerification = async (base64Payload: string) => {
    // await updateVerificationStatus({
    //           id: userId,
    //           isImageVerified: true,
    //           isVoiceVerified: false,
    //         });
    //           showToast('Verification successful!', 'success', 4000);
    //       navigation.navigate('HelpSelection');
    //       dispatch(setRootScreen('AuthNavigator'));
    //       dispatch(setAuthScreen('HelpSelection'));
    //       dispatch(setLoginStatus(true));

    try {
      const response = await verifyFaceImage(base64Payload);

      if (response && response.success && response.data) {
        const { faces_detected, confidence, gender } = response.data;
        const detectedGender = gender?.toLowerCase();

        if (faces_detected !== 1) {
          showToast(
            `Verification failed: Expected 1 face, but detected ${faces_detected}.`,
            'error',
            3000,
          );
          setBase64Image(null); // Clear image on mismatch to let user retry
          return;
        }

        if (confidence <= 0.75) {
          showToast(
            `Verification failed: Low confidence score (${(confidence * 100).toFixed(1)}%). Please try again.`,
            'error',
            3000,
          );
          setBase64Image(null);
          return;
        }

        if (detectedGender !== 'male') {
          showToast(
            'Verification failed: Only male users are permitted.',
            'error',
            3000,
          );
          setBase64Image(null);
          return;
        }

        try {
          await updateVerificationStatus({
            id: userId,
            isImageVerified: true,
            isVoiceVerified: false,
          });
        } catch (patchError: any) {
          const patchErrorMessage = 
            patchError.response?.data?.message || 
            patchError.response?.data?.error || 
            patchError.message || 
            'Failed to update verification records. Please try again.';

          showToast(
            `Status Error: ${patchErrorMessage}`,
            'error',
            3000,
          );
          setBase64Image(null);
          return; 
        }

        showToast('Verification successful!', 'success', 3000);
        navigation.navigate('HelpSelection');
        dispatch(setRootScreen('AuthNavigator'));
        dispatch(setAuthScreen('HelpSelection'));
        dispatch(setLoginStatus(true));

      } else {
        showToast(response?.message || 'Verification failed.', 'error', 3000);
        setBase64Image(null);
      }
    } catch (error: any) {
      const serverErrorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error;

      const fallbackMessage = 
        error.message || 
        'Network error or request timed out. Please try again.';

      const finalErrorMessage = serverErrorMessage || fallbackMessage;

      showToast(
        `Verification Error: ${finalErrorMessage}`,
        'error',
        3000,
      );
      setBase64Image(null); // Reset on error
    }
  };

  const handleCapturePhoto = async () => {
    if (!cameraRef.current || !photoOutput || isCapturing) return;

    try {
      setIsCapturing(true);
      const photoInstance = await photoOutput.capturePhoto(cameraRef.current, {
        flashMode: 'off',
        enableShutterSound: false,
      });

      const photoPath = await photoInstance.saveToTemporaryFileAsync();
      const cleanedBase64 = await convertUriToBase64(photoPath);

      // Freeze image screen display
      setBase64Image(cleanedBase64);
      photoInstance.dispose();

      // Dispatch backend validation process while image stays held
      await executeFaceVerification(cleanedBase64);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verification</Text>
      </View>

      <View style={styles.cameraBoxContainer}>
        {hasPermission && device ? (
          <>
            {/* Active Live Camera View */}
            <Camera
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={!base64Image} // Pause camera feed once captured
              outputs={[photoOutput]}
            />

            {/* Frozen captured image overlay */}
            {base64Image && (
              <Image 
                source={{ uri: `data:image/jpeg;base64,${base64Image}` }} 
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
            )}

            {/* Up and down scanning laser effect */}
            {isCapturing && base64Image && (
              <Animated.View 
                style={[
                  styles.scanLine, 
                  { transform: [{ translateY: scanAnimation }] }
                ]} 
              />
            )}
          </>
        ) : (
          <View style={styles.permissionPlaceholder}>
            <Text style={styles.permissionText}>
              Camera access is required to capture your verification frame.
            </Text>
            <CommonButton
              text="Enable Camera"
              backgroundColor={colors?.primary || '#00E676'}
              textColor={colors?.black || '#000000'}
              style={styles.enableButtonCustom}
              textStyle={styles.enableButtonTextCustom}
              onPress={handleEnableCamera}
            />
          </View>
        )}
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.instructionText}>
          {base64Image ? 'Verifying identity details...' : 'Focus your face within the frame to verify your identity.'}
        </Text>

        <TouchableOpacity
          disabled={!hasPermission || isCapturing || !!base64Image}
          onPress={handleCapturePhoto}
          style={[
            styles.shutterOuterCircle,
            (!hasPermission || isCapturing || !!base64Image) && { opacity: 0.4 },
          ]}
        >
          <View style={styles.shutterInnerCircle}>
            {isCapturing ? (
              <ActivityIndicator color={colors?.white || '#FFF'} />
            ) : (
              <View style={styles.shutterInnerButtonFiller} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FaceVerificationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center' },
  header: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cameraBoxContainer: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    backgroundColor: '#1C1C1E',
    borderRadius: 36,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    position: 'relative'
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 4,
    backgroundColor: '#00E676', // Color matched matching your theme green
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  permissionPlaceholder: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  enableButtonCustom: { height: 50, width: 180, borderRadius: 25 },
  enableButtonTextCustom: { fontSize: 16, fontWeight: '700' },
  footerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingBottom: 20,
  },
  instructionText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  shutterOuterCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: '#3A3A3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInnerCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInnerButtonFiller: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
  },
});