import { StyleSheet, Text, TouchableOpacity, View , ScrollView} from 'react-native'
import React, { useState } from 'react'
import { spacingX, spacingY, colors, radius } from '@/constants/theme'
import { Avatar, Header, InputField, ScreenWrapper, Typo, Button } from '@/src/components'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ConversationItem from '@/src/components/ConversationItem'
import { InitialsAvatar } from '@/src/components/InitialsAvatar'
 
// Dummy contacts data
const DUMMY_CONTACTS = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    type: 'private',
    lastMessage: null,
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: null,
    type: 'private',
    lastMessage: null,
  },
  {
    _id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: null,
    type: 'private',
    lastMessage: null,
  },
  {
    _id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    avatar: null,
    type: 'private',
    lastMessage: null,
  },
  {
    _id: '5',
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    avatar: null,
    type: 'private',
    lastMessage: null,
  },
  {
    _id: '6',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    avatar: null,
    type: 'private',
    lastMessage: null,
  },
  {
    _id: '7',
    name: 'David Miller',
    email: 'david.miller@example.com',
    avatar: null,
    type: 'private',
    lastMessage: null,
  },
  {
    _id: '8',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    avatar: null,
    type: 'private',
    lastMessage: null,
  },
  {
    _id: '9',
    name: 'Team Alpha',
    email: 'team.alpha@example.com',
    avatar: null,
    type: 'group',
    lastMessage: null,
  },
  {
    _id: '10',
    name: 'Project Beta',
    email: 'project.beta@example.com',
    avatar: null,
    type: 'group',
    lastMessage: null,
  },
]

interface NewConversationsModalProps {
  rightIcon?: React.ReactNode
  onRightPress?: () => void
}

const newConversationsModal = ({ rightIcon, onRightPress }: NewConversationsModalProps) => {
  const { isGroup } = useLocalSearchParams()

  const isGroupMode = isGroup =='groups'
  const router = useRouter()
  const [groupName, setGroupName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  const isUserSelected = (userId: string) => {
    return selectedUsers.includes(userId)
  }

  const handleCreateGroup = () => {
    if (selectedUsers.length >= 2) {
      console.log('Creating group:', { groupName, selectedUsers })
      // TODO: Implement group creation logic
      router.back()
    }
  }

  const isCreateButtonEnabled = isGroupMode && selectedUsers.length >= 2

  return (
   <ScreenWrapper isModal={true} showPattern={false} >
      <View style={styles.container}>
          <Header
            title={isGroupMode ? "New Group" : "Select user"}
            showBackButton={true}
            rightIcon={rightIcon}
            onRightPress={onRightPress}
          />
          {
            isGroupMode && (
              <View style={styles.groupInfoContainer}>
                 <View style={styles.avatarContainer}>
                  <Avatar uri={null} size={100} isGroup={true}/>
                 </View>
                 <View style={styles.groupNameContainer}>
                     <InputField 
                        placeholder='Enter Group Name'
                        value={groupName}
                        onChangeText={setGroupName}
                        
                      />
                 </View>
              </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.contactList}>

                 {
                  DUMMY_CONTACTS.map((item: any, index) =>{
                    const isSelected = isUserSelected(item._id)
                    return(
                       <TouchableOpacity
                                         key={index}
                                         style={[styles.contactRow , isSelected && styles.selectedBackground]}
                                         onPress={() => isGroupMode ? toggleUserSelection(item._id) : router.back()} >

                        <InitialsAvatar name={item.name} size={45}/>
                        <Typo fontWeight={'500'} style={styles.contactName}>
                          {item.name}
                        </Typo>
                        {isGroupMode && (
                          <View style={[
                            styles.checkbox,
                            isSelected && styles.checkboxSelected
                          ]}>
                            {isSelected && <View style={styles.checkboxInner} />}
                          </View>
                        )}
                       </TouchableOpacity>
                    )
                  })
                 }

            </ScrollView>

            {isGroupMode && selectedUsers.length >= 2 && (
              <View style={styles.footerContainer}>
                <Button
                  title="Create Group"
                  onPress={handleCreateGroup}
                  style={styles.createButton}
                  textStyle={styles.createButtonText}
                />
              </View>
            )}
      </View>
   </ScreenWrapper>
  )
}

export default newConversationsModal

const styles = StyleSheet.create({
    container: {
      marginHorizontal: spacingX._15,
      flex:1
    },
    groupInfoContainer:{
      alignItems:'center',
      marginTop:spacingY._10
    },
    avatarContainer:{
      marginBottom:spacingY._10
    },
    groupNameContainer:{
     width:'100%'
    },
    contactList:{
      gap: spacingY._12,
      marginTop: spacingY._10,
      paddingTop: spacingY._10,
      paddingBottom: spacingY._20,
    },
    contactRow:{
      flexDirection:'row',
      alignItems:'center',
      gap: spacingX._10,
      paddingVertical: spacingY._10,
      paddingHorizontal: spacingX._10,
    },
    contactName: {
      flex: 1,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#FFD700',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    checkboxSelected: {
      backgroundColor: '#FFD700',
    },
    checkboxInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.white,
    },
    selectedBackground: {
      backgroundColor:colors.neutral200,
      borderRadius: radius._15
    },
    footerContainer: {
      paddingVertical: spacingY._15,
      paddingHorizontal: spacingX._10,
    },
    createButton: {
      backgroundColor: '#FFD700',
      borderRadius: 25,
      paddingVertical: spacingY._15,
    },
    createButtonText: {
      color: colors.neutral900,
      fontSize: 18,
      fontWeight: '700',
    }
})