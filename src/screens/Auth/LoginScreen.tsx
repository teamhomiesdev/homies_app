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
import colors from '../../theme/colors';
import CommonButton from '../../components/Button/Button';
import images from '../../theme/images';
import Google from "../../assets/svg/google.svg"

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CAROUSEL_DATA = [
  { id: '1', image: images.loginBanner },
  { id: '2', image: images.loginBanner }, 
];

const LoginScreen = ({ navigation }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll effect
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

  // Handle manual swipe overrides
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / SCREEN_WIDTH);
    
    if (currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
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
          onPress={() => {
            /* Handle Google Auth logic here */
          }}
        />

        {/* Footer */}
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
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 46,
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
  signupText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});