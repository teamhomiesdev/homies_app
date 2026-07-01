import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  AppState,
  AppStateStatus,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useDispatch } from 'react-redux';
import RNFS from 'react-native-fs';
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice';

const { width } = Dimensions.get('window');

const FaceVerificationScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('front');

  const { hasPermission, requestPermission } = useCameraPermission();
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhotoPath, setCapturedPhotoPath] = useState<string | null>(null);
  const [base64Output, setBase64Output] = useState<string | null>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      await requestPermission();
    }
    appState.current = nextAppState;
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (!granted) {
      Alert.alert(
        'Camera Access Required',
        'Open App Settings to enable camera permissions manually?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
    }
  };

  const navigateToVoice = () => {
    navigation.navigate('VoiceVerification');
    dispatch(setRootScreen('AuthNavigator'));
    dispatch(setAuthScreen('VoiceVerification'));
    dispatch(setLoginStatus(false));
  };

const takePhoto = async (): Promise<void> => {
  if (!cameraRef.current || isCapturing) {
    return;
  }

  try {
    setIsCapturing(true);

    const photo = await cameraRef.current.takePhoto({
      flash: 'off',
      enableShutterSound: false,
    });

    console.log('Photo:', photo);
    

    // photo.path is absolute path returned by Vision Camera
    const imagePath = photo.path;

    // Read image directly as Base64
    const base64 = await RNFS.readFile(imagePath, 'base64');

    setCapturedPhotoPath(imagePath);
    setBase64Output(base64);

    console.log('Base64 created successfully');
  } catch (error) {
      navigation.navigate('VoiceVerification');
    dispatch(setRootScreen('AuthNavigator'));
    dispatch(setAuthScreen('VoiceVerification'));
    dispatch(setLoginStatus(false));
    console.log('Capture Error:', error);

    if (error instanceof Error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Error', 'Unable to capture image.');
    }
  } finally {
    setIsCapturing(false);
  }
};
  const handleConfirmImage = () => {
    if (base64Output) {
      Alert.alert('Success', 'Face verified successfully!', [
        { text: 'Proceed', onPress: navigateToVoice }
      ]);
    }
  };

  const handleRetake = () => {
    setCapturedPhotoPath(null);
    setBase64Output(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verification</Text>
      </View>

      <View style={styles.cameraWrapper}>
        {capturedPhotoPath ? (
          <Image
    source={{
        uri: capturedPhotoPath?.startsWith('file://')
            ? capturedPhotoPath
            : `file://${capturedPhotoPath}`,
    }}
    style={StyleSheet.absoluteFill}
    resizeMode="cover"
/>
        ) : hasPermission && device ? (
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              Camera access is required to capture your verification frame.
            </Text>
            <TouchableOpacity style={styles.permissionBtn} onPress={handleRequestPermission}>
              <Text style={styles.permissionBtnText}>Enable Camera</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.overlayFrame} />
      </View>

      {capturedPhotoPath ? (
        <>
          <Text style={styles.instructionText}>
            Ensure your face is clear and fully visible inside the box frame.
          </Text>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={[styles.actionBtn, styles.retakeBtn]} onPress={handleRetake}>
              <Text style={styles.retakeBtnText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionBtn, styles.confirmBtn]} onPress={handleConfirmImage}>
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.instructionText}>
            Focus your face within the frame to verify your identity.
          </Text>

          <View style={styles.bottomContainer}>
            <TouchableOpacity 
              style={[styles.captureButtonOuter, !hasPermission && styles.disabledOuterRing]} 
              onPress={takePhoto}
              disabled={isCapturing || !hasPermission}
              activeOpacity={0.8}
            >
              <View style={[styles.captureButtonInner, !hasPermission && { backgroundColor: '#2C2C2E' }]}>
                {isCapturing && <ActivityIndicator color="#000" />}
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default FaceVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cameraWrapper: {
    width: width * 0.85,
    height: width * 1.2,
    borderRadius: 40,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1C1C1E',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  placeholderText: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  permissionBtn: {
    backgroundColor: '#4CD964',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  permissionBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
  },
  overlayFrame: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 40,
    borderStyle: 'dashed',
    margin: 16, 
  },
  instructionText: {
    color: '#8A8A8E',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
    marginVertical: 10,
  },
  bottomContainer: {
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: '#4CD964',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledOuterRing: {
    borderColor: '#2C2C2E',
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  actionBtn: {
    width: width * 0.38,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeBtn: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  retakeBtnText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: '#4CD964',
  },
  confirmBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});