import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SignOut } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/src/components/screen-wrapper';
import { Header } from '@/src/components/Header';
import { Avatar } from '@/src/components/Avatar';
import { InputField } from '@/src/components/InputField';
import { Button } from '@/src/components/Button';
import Typo from '@/src/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { useAuth } from '@/src/contexts/AuthContext';

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleEditAvatar = () => {
    // TODO: Implement image picker
    console.log('Edit avatar pressed');
  };

  const handleUpdate = () => {
    // TODO: Implement update profile API call
    console.log('Update profile:', { name });
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ScreenWrapper showPattern={false} isModal useSafeArea={false}>
      <Header title="Update Profile" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={styles.avatarContainer}>
          <Avatar
            uri={user?.avatar}
            size={verticalScale(150)}
            showEditButton
            onEditPress={handleEditAvatar}
          />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Typo
              size={14}
              fontWeight="500"
              color={colors.neutral600}
              style={styles.label}
            >
              Email
            </Typo>
            <InputField
              value={email}
              disabled={true}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Typo
              size={14}
              fontWeight="500"
              color={colors.neutral600}
              style={styles.label}
            >
              Name
            </Typo>
            <InputField
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              returnKeyType="done"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <SignOut size={28} color={colors.white} weight="bold" />
          </TouchableOpacity>

          <Button
            title="Update"
            onPress={handleUpdate}
            style={styles.updateButton}
            textStyle={styles.updateButtonText}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacingX._20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: spacingY._20,
    marginBottom: spacingY._40,
  },
  formContainer: {
    gap: spacingY._20,
    marginBottom: spacingY._30,
  },
  fieldContainer: {
    gap: spacingY._10,
  },
  label: {
    marginLeft: spacingX._5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacingY._20,
    paddingBottom: spacingY._30,
    gap: spacingX._15,
    marginTop: 'auto',
  },
  logoutButton: {
    width: verticalScale(60),
    height: verticalScale(60),
    borderRadius: verticalScale(30),
    backgroundColor: colors.rose,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  updateButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  updateButtonText: {
    color: colors.neutral800,
  },
});
