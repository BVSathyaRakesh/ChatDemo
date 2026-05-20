import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { HomeScreen } from '@/src/screens/home.screen'
import { useAuth } from '@/src/contexts/AuthContext'

const home = () => {
  return (
   <HomeScreen />
  )
}

export default home

const styles = StyleSheet.create({})