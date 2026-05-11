import { colors, spacingX, spacingY } from '@/constants/theme';
import BackButton from '@/src/components/BackButton';
import { useRouter } from 'expo-router';
import { At, Lock, User } from 'phosphor-react-native';
import { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, InputField, ScreenWrapper, Typo } from '../components';
import { useAuth } from '@/src/contexts/AuthContext';

export function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const userName = useRef("");
  const email = useRef("");
  const password = useRef("");
  const [loading, setLoading] = useState(false);

  const handleHelp = () => {
    // TODO: Add help navigation
    console.log('Need help pressed');
  };

  const handleSignUp = async () => {
    // Validate inputs
    if (!userName.current || !email.current || !password.current) {
      Alert.alert("Sign up", "Please fill all the details");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.current)) {
      Alert.alert("Sign up", "Please enter a valid email");
      return;
    }

    // Password length validation
    if (password.current.length < 6) {
      Alert.alert("Sign up", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register({
        email: email.current,
        password: password.current,
        name: userName.current,
      });

      // Navigate to main app after successful registration
      router.replace('/(main)/home');

    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error instanceof Error ? error.message : "Unable to create account"
      );
    } finally {
      setLoading(false);
      }
  };

  const handleLoginPress = () => {
    router.push('/(auth)/login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
     <ScreenWrapper flex={0} style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.headerContent}>
          <BackButton />
          <TouchableOpacity onPress={handleHelp}>
            <Typo size={17} color={colors.white}>
              Need some help?
            </Typo>
          </TouchableOpacity>
        </SafeAreaView>
      </ScreenWrapper>
      {/* White Content Area */}
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.formContent}>
            <Typo size={28} fontWeight={'600'} color={colors.text}>
              Getting Started
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              Create an account to continue
            </Typo>

            {/* Input Fields */}
            <View style={styles.inputsContainer}>
              <InputField
                placeholder="Enter your name"
                onChangeText={(text) => (userName.current = text)}
                icon={<User size={24} color={colors.neutral500} />}
              />
              <InputField
                placeholder="Enter your email"
                onChangeText={(text) => (email.current = text)}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<At size={24} color={colors.neutral500} />}
              />
              <InputField
                placeholder="Enter your password"
                onChangeText={(text) => (password.current = text)}
                secureTextEntry
                autoCapitalize="none"
                icon={<Lock size={24} color={colors.neutral500} />}
              />
            </View>

            {/* Sign Up Button */}
            <Button
              title={loading ? "Creating account..." : "Sign Up"}
              onPress={handleSignUp}
              style={styles.signUpButton}
              textStyle={styles.signUpButtonText}
              disabled={loading}
            />

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Typo size={15} color={colors.neutral600}>
                Already have an account?{' '}
              </Typo>
              <TouchableOpacity onPress={handleLoginPress} disabled={loading}>
                <Typo size={15} color={colors.primary} fontWeight="600">
                  Login
                </Typo>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
     
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
  header: {
    height: 180,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: -30,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  form: {
    paddingBottom: spacingY._30,
  },
  formContent: {
    gap: spacingY._10,
    marginHorizontal: spacingX._20,
    marginTop: spacingY._25,
  },
  inputsContainer: {
    gap: spacingY._15,
    marginTop: spacingY._20,
  },
  signUpButton: {
    backgroundColor: colors.primary,
    marginTop: spacingY._25,
  },
  signUpButtonText: {
    color: colors.text,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacingY._15,
  },
});
