import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import colors from '../../theme/colors';

type InputType = 'text' | 'phone' | 'textarea';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  type?: InputType;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  type = 'text',
  containerStyle,
  inputStyle,
  ...props
}) => {
  const isTextArea = type === 'textarea';
  const isPhone = type === 'phone';

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.container,
          isTextArea && styles.textAreaContainer,
          error && styles.errorBorder,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            isTextArea && styles.textArea,
            inputStyle,
          ]}
          placeholderTextColor={colors.gray_3}
          keyboardType={isPhone ? 'phone-pad' : props.keyboardType}
          multiline={isTextArea}
          numberOfLines={isTextArea ? 4 : 1}
          textAlignVertical={isTextArea ? 'top' : 'center'}
          {...props}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },

  label: {
    color: colors.white,
    marginBottom: 8,
    fontSize: 16,
  },

  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray_4,
  },

  input: {
    color: colors.white,
    fontSize: 18,
    paddingVertical: 14,
  },

  textAreaContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },

  textArea: {
    minHeight: 120,
  },

  errorBorder: {
    borderColor: colors.error,
  },

  error: {
    color: colors.error,
    marginTop: 6,
    fontSize: 13,
  },
});