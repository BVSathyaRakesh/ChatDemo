import { StyleSheet , TouchableOpacity, View} from 'react-native'
import React from 'react'
import { ScreenWrapper } from '@/src/components/screen-wrapper'
import { Typo } from '../components'
import { colors, radius, spacingX } from '@/constants/theme'
import { useAuth } from '../contexts/AuthContext'
import * as Icons from 'phosphor-react-native';
import { verticalScale } from '../utils'
import { useRouter } from 'expo-router'

const HomeScreen = () => {

    const { user,  login } = useAuth();
    const router = useRouter();

  return (
    <ScreenWrapper isModal={false} style={styles.container}>
          <View style={styles.headerContainer}>
              <Typo color={colors.neutral200} size={19} fontWeight="500">
                  Welcome back, {""}
                  <Typo size={20} color={colors.white} style={{ fontWeight: '800' }}>{user?.name}</Typo>
              </Typo>
              <TouchableOpacity onPress={() =>{
                  router.push("/(main)/profilemodal");
              }}>
                <Icons.GearSixIcon color={colors.white} size={verticalScale(22)} weight='fill'  />
              </TouchableOpacity>
          </View>
          <View style={styles.content}>

          </View>
    </ScreenWrapper>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    
  },
  headerContainer:{
    padding:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content:{
   flex:1,
   backgroundColor: colors.white,
   marginTop: 10,
   borderTopLeftRadius:30,
   borderTopRightRadius:30,
   marginBottom: -40
  }
})