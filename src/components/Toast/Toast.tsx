import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ToastRef {
  show: (options: ToastOptions) => void;
  hide: () => void;
}

let toastRefGlobal: any = null;

export const Toast = forwardRef<ToastRef, {}>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateYAnim] = useState(new Animated.Value(-40));

  useImperativeHandle(ref, () => ({
    show: ({ message, type, duration = 3000 }) => {
      setMessage(message);
      setType(type);
      setVisible(true);

      // Trigger animated entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // Setup automatic dismissal timer
      const timeout = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timeout);
    },
    hide: () => {
      hideToast();
    },
  }));

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  };

  if (!visible) return null;

  // Configure color indicators based on types
  const getStylesByType = () => {
    switch (type) {
      case 'success':
        return {
          bg: '#142414',
          border: colors.primary || '#5C7A50',
          text: '#FFFFFF',
          tag: '✓ Success',
        };
      case 'error':
        return {
          bg: '#2C1414',
          border: '#FF4D4D',
          text: '#FFFFFF',
          tag: '✕ Error',
        };
      case 'warning':
        return {
          bg: '#2C2414',
          border: '#FFC107',
          text: '#FFFFFF',
          tag: '⚠ Warning',
        };
    }
  };

  const currentTheme = getStylesByType();

  return (
    <Animated.View
      style={[
        styles.overlayContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
        },
      ]}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={hideToast}
          style={[
            styles.toastCard,
            { backgroundColor: currentTheme.bg, borderColor: currentTheme.border },
          ]}
        >
          <View style={styles.contentRow}>
            <View style={styles.textBlock}>
              <Text style={[styles.typeBadge, { color: currentTheme.border }]}>
                {currentTheme.tag}
              </Text>
              <Text style={[styles.messageText, { color: currentTheme.text }]}>
                {message}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
});

// Static reference caller hook to trigger alerts from anywhere
export const showToast = (message: string, type: ToastType = 'success', duration?: number) => {
  if (toastRefGlobal) {
    toastRefGlobal.show({ message, type, duration });
  } else {
    console.warn("Toast component hasn't been mounted in your root layout tree yet.");
  }
};

export const registerToastRef = (ref: ToastRef | null) => {
  toastRefGlobal = ref;
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  safeArea: {
    width: '100%',
    alignItems: 'center',
  },
  toastCard: {
    width: width - 32,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
  },
  typeBadge: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  messageText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
});