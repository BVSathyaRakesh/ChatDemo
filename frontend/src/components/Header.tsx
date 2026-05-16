import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'phosphor-react-native';
import { HeaderProps } from '@/src/types/header.types';
import Typo from './Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useRouter } from 'expo-router';

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
  style,
  titleStyle,
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.neutral800} weight="bold" />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Typo
          size={20}
          fontWeight="600"
          color={colors.neutral800}
          style={titleStyle}
        >
          {title}
        </Typo>
      </View>
      {rightComponent && <View style={styles.rightContainer}>{rightComponent}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: spacingX._20,
    zIndex: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    position: 'absolute',
    right: spacingX._20,
    zIndex: 1,
  },
});
