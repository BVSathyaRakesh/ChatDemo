import { colors, spacingX, spacingY } from '@/constants/theme'
import { Button, ScreenWrapper, Typo } from '@/src/components'
import { verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

const welcome = () => {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/register')
  }

  return (
    <ScreenWrapper >
      <View style={styles.container}>
          <Typo color={colors.white} size={43} fontWeight={'900'}>
            Messenger
          </Typo>
        <Animated.View entering={FadeInDown.duration(800).delay(700).springify()}>
          <Image
            source={require('@/assets/images/welcome.png')}
            style={styles.welcomeImage}
            contentFit="contain"
          />
        </Animated.View>
        <View>
          <Typo color={colors.white} size={33} fontWeight={'800'}>
            Stay Connected
          </Typo>
          <Typo color={colors.white} size={33} fontWeight={'800'}>
           with ur friends
          </Typo>
          <Typo color={colors.white} size={33} fontWeight={'800'}>
          and family
          </Typo>
        </View>
        <Animated.View entering={FadeInDown.duration(800).delay(1400).springify()} style={{ width: '100%' }}>
          <View>
            <Button
              title="Get Started"
              onPress={handleGetStarted}
            />
          </View>
        </Animated.View>
      </View>
    </ScreenWrapper>
  )
}

export default welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal:spacingX._20,
    marginVertical:spacingY._10
  },
  background: {
     flex: 1,
     backgroundColor: colors.neutral900,
  },
  welcomeImage: {
    height: verticalScale(300),
    aspectRatio:1,
    alignSelf:'center'
  }
})