import React from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  flex?: number;
  useSafeArea?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  flex = 1,
  useSafeArea = true
}) => {
  const content = (
    <ImageBackground
      source={require('@/assets/images/bgPattern.png')}
      style={[styles.background, { flex }]}
      resizeMode="cover"
    >
      {useSafeArea ? (
        <SafeAreaView style={[styles.container, { flex }, style]}>
          {children}
        </SafeAreaView>
      ) : (
        <View style={[styles.container, { flex }, style]}>
          {children}
        </View>
      )}
    </ImageBackground>
  );

  return content;
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
  },
  container: {
    // flex is now dynamic via props
  },
});
