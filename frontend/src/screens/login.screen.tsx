import { colors, spacingX, spacingY } from '@/constants/theme';
import BackButton from '@/src/components/BackButton';
import { useRouter } from 'expo-router';
import { At, Lock } from 'phosphor-react-native';
import { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, InputField, ScreenWrapper, Typo } from '../components';
import { useAuth } from '@/src/contexts/AuthContext';

export function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const email = useRef("");
  const password = useRef("");
  const [loading, setLoading] = useState(false);

  const handleHelp = () => {
    // TODO: Add forgot password navigation
    console.log('Need help pressed');
  };

  const handleLogin = async () => {
    // Validate inputs
    if (!email.current || !password.current) {
      Alert.alert("Login", "Please fill all the details");
      return;
    }

    setLoading(true);
    try {
      await login({
        email: email.current,
        password: password.current,
      });

      // Navigate to main app after successful login
      router.replace('/(main)/home'); 

    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpPress = () => {
    router.push('/(auth)/register');
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
              Forgot Password?
            </Typo>
          </TouchableOpacity>
        </SafeAreaView>
      </ScreenWrapper>
      {/* White Content Area */}
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.formContent}>
            <Typo size={28} fontWeight={'600'} color={colors.text}>
              Welcome Back
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              We are happy to see you back
            </Typo>

            {/* Input Fields */}
            <View style={styles.inputsContainer}>
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

            {/* Login Button */}
            <Button
              title={loading ? "Logging in..." : "Login"}
              onPress={handleLogin}
              style={styles.signUpButton}
              textStyle={styles.signUpButtonText}
              disabled={loading}
            />

            {/* Sign Up Link */}
            <View style={styles.loginContainer}>
              <Typo size={15} color={colors.neutral600}>
                Don't have an account?{' '}
              </Typo>
              <TouchableOpacity onPress={handleSignUpPress} disabled={loading}>
                <Typo size={15} color={colors.primary} fontWeight="600">
                  Sign up
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
