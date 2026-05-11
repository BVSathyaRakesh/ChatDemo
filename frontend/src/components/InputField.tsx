import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import React, { useRef } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, Animated } from 'react-native';

interface InputFieldProps extends TextInputProps {
  icon?: React.ReactNode;
}

export const InputField = ({ icon, ...props }: InputFieldProps) => {
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    Animated.timing(borderColorAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    Animated.timing(borderColorAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    props.onBlur?.(e);
  };

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', colors.primary],
  });

  return (
    <Animated.View style={[styles.container, { borderColor }]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.neutral400}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral100,
    borderRadius: radius._30,
    paddingHorizontal: spacingX._20,
    height: verticalScale(56),
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: spacingX._12,
  },
  input: {
    flex: 1,
    fontSize: verticalScale(16),
    color: colors.text,
  },
});
