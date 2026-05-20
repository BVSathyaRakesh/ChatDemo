import { StyleSheet , TouchableOpacity, View,ScrollView} from 'react-native'
import React, { useState } from 'react'
import { ScreenWrapper } from '@/src/components/screen-wrapper'
import { Typo, Loader } from '../components'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '../contexts/AuthContext'
import * as Icons from 'phosphor-react-native';
import { Plus } from 'phosphor-react-native';
import { verticalScale } from '../utils'
import { useRouter } from 'expo-router'
import ConversationItem from '../components/ConversationItem'

import { Button } from '../components'

 export  function HomeScreen()  {

    const { user,  login } = useAuth();
    const [activeTab, setActiveTab] = useState('direct')
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const conversations = [
      {
        name:"Alice",
        type:'direct',
        lastMessage: {
          senderName: 'Alice',
          content:'Hey Are We still on for tonight?',
          createdAt:"2025-06-22T18:45:00Z"
        },
      },
      {
        name:"Project Team",
        type:'group',
        lastMessage: {
          senderName: 'Sarah',
          content:'Meeting Rescheduled to 3pm tomorrow',
          createdAt:"2025-06-22T14:10:00Z"
        },
      },
      {
        name:"Bob",
        type:'direct',
        lastMessage: {
          senderName: 'bob',
          content:'Thanks for reply',
          createdAt:"2025-06-22T18:45:00Z"
        },
      },
      {
        name:"Family Group",
        type:'group',
        lastMessage: {
          senderName: 'charlie',
          content:'Thanks',
          createdAt:"2025-06-22T14:10:00Z"
        },
      },
      {
        name:"charlie",
        type:'direct',
        lastMessage: {
          senderName: 'charlie',
          content:'Nice way to connect',
          createdAt:"2025-06-22T18:45:00Z"
        },
      },
    ]
  
    let directConversations = conversations
    .filter((item: any) => (item.type === 'direct'))
    .sort((a:any,b:any) =>{
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime()
    })

    let groupConversations = conversations
    .filter((item: any) => (item.type === 'group'))
    .sort((a:any,b:any) =>{
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime()
    })
    const directMessagesHandler = () => {
        setActiveTab('direct')
    }

    const groupsMessagesHandler = () => {
      setActiveTab('groups')
    }

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: spacingY._20 }}>
          <View style={styles.tabBarContainer}>
            <TouchableOpacity style={activeTab == 'direct' ? 
              styles.activeTabContainer : styles.inActiveTabContainer}
              onPress={directMessagesHandler}>
              <Typo>
                Direct Messages
              </Typo>
            </TouchableOpacity>
            <TouchableOpacity style={activeTab == 'groups' ? 
              styles.activeTabContainer : styles.inActiveTabContainer} 
              onPress={groupsMessagesHandler}>
              <Typo>
                Groups
              </Typo>
            </TouchableOpacity>
          </View>
          <View style={styles.conversationList}>
            {isLoading ? (
              <Loader text="Loading conversations..." />
            ) : (
              <>
                {activeTab === 'direct' && (
                  directConversations.length > 0 ? (
                    directConversations.map((item: any, index) => (
                      <ConversationItem
                        item={item}
                        key={index}
                        router={router}
                        showDivider={directConversations.length != index + 1}
                      />
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Icons.ChatCircleDotsIcon
                        size={60}
                        color={colors.neutral300}
                        weight="thin"
                      />
                      <Typo size={16} color={colors.neutral500} style={styles.emptyText}>
                        No direct messages yet
                      </Typo>
                      <Typo size={14} color={colors.neutral400} style={styles.emptySubtext}>
                        Start a conversation to see it here
                      </Typo>
                    </View>
                  )
                )}

                {activeTab === 'groups' && (
                  groupConversations.length > 0 ? (
                    groupConversations.map((item: any, index) => (
                      <ConversationItem
                        item={item}
                        key={index}
                        router={router}
                        showDivider={groupConversations.length != index + 1}
                      />
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Icons.UsersThreeIcon
                        size={60}
                        color={colors.neutral300}
                        weight="thin"
                      />
                      <Typo size={16} color={colors.neutral500} style={styles.emptyText}>
                        No groups yet
                      </Typo>
                      <Typo size={14} color={colors.neutral400} style={styles.emptySubtext}>
                        Create or join a group to get started
                      </Typo>
                    </View>
                  )
                )}
              </>
            )}
          </View>
        </ScrollView>
        <Button
          style={styles.floatingButton}
          onPress={() => router.push({ 
            pathname: '/(main)/newConversationsModal', 
            params: {isGroup: activeTab}}
          )}
        >
          <Plus color={colors.neutral800} weight='bold' size={verticalScale(28)} />
        </Button>
      </View>
    </ScreenWrapper>
  )};



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
   marginBottom: -40,
   position: 'relative'
  },
  tabBarContainer:{
    flexDirection:'row',
    alignContent:'center',
    justifyContent:'center',
    gap: spacingX._15,
  },
  activeTabContainer: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primaryLight
  },
  inActiveTabContainer: {
    backgroundColor: colors.neutral200,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.neutral300
  },
  conversationList:{
    paddingVertical: spacingX._20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacingY._60,
    paddingHorizontal: spacingX._40,
  },
  emptyText: {
    marginTop: spacingY._20,
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: spacingY._10,
    textAlign: 'center',
  },
  floatingButton:{
    height:verticalScale(60),
    width:verticalScale(60),
    borderRadius:100,
    position:'absolute',
    bottom:verticalScale(30),
    right:verticalScale(30),
    backgroundColor: colors.primary,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    justifyContent: 'center',
    alignItems: 'center',
  }
})