import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { SignOut } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/src/components/screen-wrapper';
import { Header } from '@/src/components/Header';
import { Avatar } from '@/src/components/Avatar';
import { InputField } from '@/src/components/InputField';
import { Button } from '@/src/components/Button';
import { Loader } from '@/src/components/Loader';
import Typo from '@/src/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { useAuth } from '@/src/contexts/AuthContext';
import { updateProfile } from '../socket/socketEvents';
import * as ImagePicker from 'expo-image-picker';

export function ProfileScreen() {
  const { user, logout, updateAuth, refreshUser } = useAuth();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const nameFieldRef = useRef<View>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null)
  const [isLoading, setISloading] = useState(false);

  
  // Refresh user data from server on mount
  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    updateProfile(processUpdateProfile);

    return () => {
      updateProfile(processUpdateProfile, true);
    }
  })

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || null);
    }
  }, [user]);

  const handleEditAvatar = async () => {
    Alert.alert(
      'Avatar Upload',
      'Avatar upload feature requires cloud storage setup (AWS S3, Cloudinary, etc.). For now, your avatar is generated from your initials.',
      [{ text: 'OK' }]
    );

    // TODO: Implement cloud storage upload
    // 1. Pick image using ImagePicker
    // 2. Upload to cloud storage (AWS S3, Cloudinary, Firebase Storage)
    // 3. Get public URL
    // 4. Save URL to database
  };

  const handleUpdate = () => {
    if (!name.trim()) {
       Alert.alert("User ", 'Please Enter your name');
       return;
    }

    // Only send avatar if it's a valid remote URL
    const data = {
      name,
      avatar: (avatar && (avatar.startsWith('http://') || avatar.startsWith('https://'))) ? avatar : null
    };

    setISloading(true);
    updateProfile(data);
  };

  const processUpdateProfile = async (res: any) => {                                                                                                  
    console.log('got res: ', res);                                                                                                                    
    setISloading(false);                                                                                                                              
                                                                                                                                                      
    if (res.success) {                                                                                                                                
      await updateAuth(res.data.token, res.data.user);                                                                                                
      Alert.alert('Success', res.msg,[
        {
          text:"ok",
          onPress: () => router.back(),
          style:'cancel'
        }
      ]);    
                                                                                                              
    } else {                                                                                                                                          
      Alert.alert('Error', res.msg);                                                                                                                  
    }                                                                                                                                                 
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const logoutHandler = () =>{
      Alert.alert("Confirm", "Are you sure you want to logout?",[
        {
          text:"cancel",
          onPress: ()=> console.log('Logout cancelled'),
          style:'cancel'
        },
        {
          text:"Logout",
          onPress: handleLogout,
          style: 'destructive'
        }
      ])
  }

  const scrollToField = () => {
    setTimeout(() => {
      nameFieldRef.current?.measureLayout(
        scrollViewRef.current as any,
        (x, y) => {
          scrollViewRef.current?.scrollTo({
            y: y - 20,
            animated: true,
          });
        },
        () => {}
      );
    }, 50);
  };

 

  return (
    <ScreenWrapper showPattern={false} isModal useSafeArea={false}>
      <Header title="Update Profile" showBackButton={Platform.OS === 'android'} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
        <View style={styles.avatarContainer}>
          <Avatar
            uri={avatar}
            name={name}
            email={email}
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
              containerStyle={{ backgroundColor: colors.neutral300 }}
            />
          </View>
          <View style={styles.fieldContainer} ref={nameFieldRef}>
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
              onFocus={scrollToField}
              containerStyle={{ backgroundColor: colors.neutral200 }}
            />
          </View>
        </View>

        <View style={styles.footer}>
          {isLoading ? (
            <Loader size="large" color={colors.primary} />
          ) : (
            <>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={logoutHandler}
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
            </>
          )}
        </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    paddingBottom: spacingY._30,
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
