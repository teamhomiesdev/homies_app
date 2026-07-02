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
import Google from '../../assets/svg/google.svg';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { setGoogleProfileCache } from '../../redux/slices/authSlice';
import { showToast } from '../../components/Toast/Toast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CAROUSEL_DATA = [
  { id: '1', image: images.loginBanner },
  { id: '2', image: images.loginBanner },
];

const RegisterScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<any>(); // typed as any or ThunkDispatch depending on configuration
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '511277179417-avfupmlk5pjb2qjgc1fhmp89n905a10f.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex =
        activeIndex === CAROUSEL_DATA.length - 1 ? 0 : activeIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / SCREEN_WIDTH);
    setActiveIndex(currentIndex);
  };

  const handleGoogleRegister = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const userInfo = response.data;

      if (!userInfo || !userInfo.user) {
        throw new Error(
          'Google authentication returned an empty identity profile.',
        );
      }

      // Save user fields cleanly to our temporary store cache
      dispatch(
        setGoogleProfileCache({
          email: userInfo.user.email,
          firstName: userInfo.user.givenName || userInfo.user.name || 'Vasanth',
        }),
      );

      showToast("Google Login Success! Please fill out your basic details to complete registration.", "success", 4000);
      // Direct page navigation transition
      navigation.reset({
        index: 0,
        routes: [{ name: 'BasicDetails' }],
      });
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else {
        Alert.alert(
          'Authentication Error',
          error.message || 'Something went wrong.',
        );
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
          onMomentumScrollEnd={handleMomentumScrollEnd}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          keyExtractor={item => item.id}
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

      <SafeAreaView
        edges={['bottom', 'left', 'right']}
        style={styles.bottomContainer}
      >
        <Text style={styles.title}>Join{'\n'}Us.</Text>
        <Text style={styles.subtitle}>
          Start your journey with just one click.
        </Text>
        <CommonButton
          text="Register"
          backgroundColor={colors.white}
          textColor={colors.black}
          leftIcon={<Google width={20} height={20} />}
          style={styles.googleButtonCustom}
          textStyle={styles.googleButtonTextCustom}
          onPress={handleGoogleRegister}
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'AuthNavigator' }],
              })
            }
          >
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default RegisterScreen;

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
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 56,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.gray_2,
    fontSize: 16,
    marginTop: 20,
    lineHeight: 24,
  },
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
  loginText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
});
