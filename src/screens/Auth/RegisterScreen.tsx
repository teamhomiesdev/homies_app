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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import {
  setAuthScreen,
  setLoginStatus,
  setRootScreen,
} from '../../redux/slices/authSlice';
import colors from '../../theme/colors';
import CommonButton from '../../components/Button/Button';
import images from '../../theme/images';
import Google from "../../assets/svg/google.svg";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CAROUSEL_DATA = [
  { id: '1', image: images.loginBanner },
  { id: '2', image: images.loginBanner }, 
];

const RegisterScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll loop effect
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = activeIndex === CAROUSEL_DATA.length - 1 ? 0 : activeIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setActiveIndex(nextIndex);
    }, 3000); // Changes slide every 3 seconds

    return () => clearInterval(timer);
  }, [activeIndex]);

  // Track page changes accurately only when swiping animation stops completely
  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / SCREEN_WIDTH);
    setActiveIndex(currentIndex);
  };

  const handleRegister = () => {
    navigation.navigate('BasicDetails');
    dispatch(setRootScreen('AuthNavigator'));
    dispatch(setAuthScreen('BasicDetails'));
    dispatch(setLoginStatus(false));
  };

  return (
    <View style={styles.container}>
      {/* Auto Scrolling Image Slider */}
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

        {/* Dynamic Carousel Indicators */}
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

      {/* Bottom Sheet Card */}
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.bottomContainer}>
        <Text style={styles.title}>
          Join{'\n'}
          Us.
        </Text>

        <Text style={styles.subtitle}>
          Start your journey with just one click.
        </Text>

        {/* Google Registration Button */}
        <CommonButton
          text="Register"
          backgroundColor={colors.white}
          textColor={colors.black}
          leftIcon={<Google width={20} height={20}/>}
          style={styles.googleButtonCustom}
          textStyle={styles.googleButtonTextCustom}
          onPress={handleRegister}
        />

        {/* Footer Navigation Back to Login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'AuthNavigator' }],
              });
            }}
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
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  imageContainer: {
    flex: 0.48,
    position: 'relative',
  },
  carouselItem: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  dot: {
    height: 7,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 28,
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: colors.gray_1,
  },
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
  googleButtonTextCustom: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 8,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.gray_2,
    fontSize: 16,
  },
  loginText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});