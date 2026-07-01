import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';

import colors from '../../theme/colors';

interface ButtonProps {
  text: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  backgroundColor?: string;
  textColor?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CommonButton: React.FC<ButtonProps> = ({
  text,
  onPress,
  disabled = false,
  loading = false,
  backgroundColor = colors.primary,
  textColor = colors.black,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? colors.gray : backgroundColor,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

          <Text style={[styles.text, { color: textColor }, textStyle]}>
            {text}
          </Text>

          {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CommonButton;

const styles = StyleSheet.create({
  button: {
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: '700',
  },
  icon: {
    marginHorizontal: 6,
  },
});
