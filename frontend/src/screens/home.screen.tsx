import { StyleSheet } from 'react-native'
import React from 'react'
import { ScreenWrapper } from '@/src/components/screen-wrapper'
import { Typo } from '../components'
import { colors } from '@/constants/theme'

const HomeScreen = () => {
  return (
    <ScreenWrapper style={styles.container}>
      <Typo color={colors.white} size={24} fontWeight="700">
        Home Screen
      </Typo>
    </ScreenWrapper>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
})