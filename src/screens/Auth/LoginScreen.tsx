import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import CommonButton from '../../components/Button/Button';
import images from '../../theme/images';
import Google from "../../assets/svg/google.svg";

// Import Google Sign-In and statusCodes
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Import loginAction
import { loginAction } from '../../redux/actions/authActions';

// IMPORT THE TOAST UTILITY
import { showToast } from '../../components/Toast/Toast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CAROUSEL_DATA = [
  { id: '1', image: images.loginBanner },
  { id: '2', image: images.loginBanner }, 
];

const LoginScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<any>(); 
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '511277179417-avfupmlk5pjb2qjgc1fhmp89n905a10f.apps.googleusercontent.com',
      offlineAccess: true, 
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= CAROUSEL_DATA.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 3000); 

    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / SCREEN_WIDTH);
    if (currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      
      const userInfo = response.data;
      if (!userInfo || !userInfo.user) {
        throw new Error('Google authentication returned an empty identity profile.');
      }

      console.log('Google Login Successful! User Info:', userInfo);

      const loginPayload = {
        email: userInfo.user.email,
        platform: 'google',
      };

      const result = await dispatch(loginAction(loginPayload));

      if (result && result.success) {
        // DISPLAY SUCCESS TOAST HERE MATCHING REGISTER SCREEN
        showToast("Login successful!", "success", 4000);

        navigation.reset({
          index: 0,
          routes: [{ name: result.targetScreen }],
        });
      } else {
        Alert.alert('Login Error', result.error || 'Failed to authenticate with backend.');
      }

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in configuration is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services are not available or outdated.');
      } else {
        Alert.alert('Authentication Error', error.message || 'Something went wrong during Google Login.');
        console.error('Detailed Error Object:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <FlatList
          ref={flatListRef}
          data={CAROUSEL_DATA}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.carouselItem}>
              <Image
                source={item.image}
                style={styles.banner}
                resizeMode="cover"
              />
            </View>
          )}
        />

        <View style={styles.dotsContainer}>
          {CAROUSEL_DATA.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.bottomContainer}>
        <Text style={styles.title}>
          BREATH OUT...{'\n'}
          YOU ARE BACK IN A{'\n'}
          JUDGEMENT FREE{'\n'}
          ZONE.
        </Text>

        <Text style={styles.subtitle}>
          Sign in to access your personalized experience.
        </Text>

        <CommonButton
          text="Login"
          backgroundColor={colors.white}
          textColor={colors.black}
          leftIcon={<Google width={20} height={20}/>}
          style={styles.googleButtonCustom}
          textStyle={styles.googleButtonTextCustom}
          onPress={handleGoogleLogin}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>New here? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  imageContainer: { flex: 0.48, position: 'relative' },
  carouselItem: { width: SCREEN_WIDTH, height: '100%' },
  banner: { width: '100%', height: '100%' },
  dotsContainer: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  dot: { height: 7, borderRadius: 4, marginHorizontal: 4 },
  activeDot: { width: 28, backgroundColor: colors.primary },
  inactiveDot: { width: 8, backgroundColor: colors.gray_1 },
  bottomContainer: {
    flex: 0.52,
    backgroundColor: colors.black_1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 28,
    paddingTop: 45,
    marginTop: -30,
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 46,
    letterSpacing: 0.5,
  },
  subtitle: { color: colors.gray_2, fontSize: 16, marginTop: 20, lineHeight: 24 },
  googleButtonCustom: {
    marginTop: 40,
    height: 64,
    borderRadius: 25,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  googleButtonTextCustom: { fontSize: 22, fontWeight: '700', marginLeft: 8 },
  footer: {
    marginTop: 'auto',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { color: colors.gray_2, fontSize: 16 },
  signupText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
});