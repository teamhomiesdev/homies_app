import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission, usePhotoOutput } from 'react-native-vision-camera';
import colors from '../../theme/colors'; 
import CommonButton from '../../components/Button/Button';

// --- REDUX, SERVICES & TOAST IMPORTS ---
import { useDispatch } from 'react-redux';
import { setRootScreen, setAuthScreen, setLoginStatus } from '../../redux/slices/authSlice'; 
import { verifyFaceImage } from '../../services/authService'; 
import { showToast } from '../../components/Toast/Toast';

interface FaceVerificationScreenProps {
  navigation: {
    navigate: (screenName: string) => void;
  };
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FaceVerificationScreen: React.FC<FaceVerificationScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  
  // State for the processed base64 string
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const photoOutput = usePhotoOutput();

  const handleEnableCamera = async () => {
    const granted = await requestPermission();
    if (!granted) {
      Alert.alert('Permission Denied', 'Please allow camera permission from Settings.');
    }
  };

  // Helper utility to safely convert local cache files to base64 on Android & iOS
  const convertUriToBase64 = (fileUri: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const fullDataUrl = reader.result as string;
          // Clean up the scheme to get the raw payload
          const rawBase64 = fullDataUrl.split(',')[1] || fullDataUrl;
          resolve(rawBase64); 
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = (error) => reject(error);
      
      const safeUri = fileUri.startsWith('file://') ? fileUri : `file://${fileUri}`;
      xhr.open('GET', safeUri);
      xhr.responseType = 'blob';
      xhr.send();
    });
  };

  // API Integration & Validation Logic
  const executeFaceVerification = async (base64Payload: string) => {
    try {
      // The 1-minute timeout is handled inside verifyFaceImage in authService.ts
      const response = await verifyFaceImage(base64Payload);

      if (response && response.success && response.data) {
        // Extract gender from the response safely
        const detectedGender = response.data.gender?.toLowerCase();

        // Strict Enforcement: Only allow "male"
        if (detectedGender === 'male') {
          showToast("Login successful!", "success", 4000);
          
          // Execute navigation and Redux updates
          navigation.navigate('HelpSelection');
          dispatch(setRootScreen('AuthNavigator')); 
          dispatch(setAuthScreen('HelpSelection'));
          dispatch(setLoginStatus(true));
        } else {
          // Reject block: handles female or unidentifiable gender cases
          showToast("Verification failed: Only male users are permitted.", "error", 4000);
        }
      } else {
        showToast(response?.message || "Verification failed.", "error", 4000);
      }

    } catch (error: any) {
      console.error('Verification Error:', error);
      showToast("Network error or request timed out. Please try again.", "error", 4000);
    }
  };

  const handleCapturePhoto = async () => {
    // Ensure both the camera reference and photo pipeline are ready
    if (!cameraRef.current || !photoOutput || isCapturing) return;

    try {
      setIsCapturing(true);

      const photoInstance = await photoOutput.capturePhoto(cameraRef.current, {
        flashMode: 'off',
        enableShutterSound: false,
      });

      const photoPath = await photoInstance.saveToTemporaryFileAsync();
      const cleanedBase64 = await convertUriToBase64(photoPath);
      
      setBase64Image(cleanedBase64);
      photoInstance.dispose();

      // Trigger the verification API call
      await executeFaceVerification(cleanedBase64);
      
    } catch (error: any) {
      console.error('Error capturing photo:', error);
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
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            outputs={[photoOutput]} 
          />
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
          Focus your face within the frame to verify your identity.
        </Text>

        <TouchableOpacity
          disabled={!hasPermission || isCapturing}
          onPress={handleCapturePhoto}
          style={[
            styles.shutterOuterCircle,
            (!hasPermission || isCapturing) && { opacity: 0.4 }
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
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', 
    alignItems: 'center',
  },
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
    width: SCREEN_WIDTH - 48,
    height: (SCREEN_WIDTH - 48) * 1.25, 
    backgroundColor: '#1C1C1E', 
    borderRadius: 36,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
  enableButtonCustom: {
    height: 50,
    width: 180,
    borderRadius: 25,
  },
  enableButtonTextCustom: {
    fontSize: 16,
    fontWeight: '700',
  },
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
  }
});