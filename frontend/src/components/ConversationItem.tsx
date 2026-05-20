import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { spacingX, spacingY, colors } from '@/constants/theme'
import { Avatar } from './Avatar'
import Typo from './Typo'
import { formatMessageTime } from '@/src/utils/dateFormat'

const ConversationItem = ({ item, showDivider, router }: any) => {

    const openConversation = () => {

    }

    const lastMessageContent = () => {
        if (!item.lastMessage) return "Say hi"
        return item.lastMessage?.attachment ? 'image' : item.lastMessage.content
    }

    return (
        <View>
            <TouchableOpacity style={styles.conversationItem} onPress={openConversation}>
                <View >
                    <Avatar uri={null} size={47} isGroup={item.type == "group"} />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                        <Typo size={17} fontWeight={'600'}>
                            {item.name}
                        </Typo>
                        {
                            item.lastMessage && (
                                <Typo size={13} color={colors.neutral500}>
                                    {formatMessageTime(item.lastMessage.createdAt)}
                                </Typo>
                            )
                        }
                    </View>
                    <Typo size={15} color={colors.neutral600} textProps={{ numberOfLines: 1 }}>
                        {lastMessageContent()}
                    </Typo>

                </View>
            </TouchableOpacity>
            {showDivider && <View style={styles.divider}>

            </View>}
        </View>
    )
}

export default ConversationItem

const styles = StyleSheet.create({
    conversationItem: {
        gap: spacingX._10,
        marginVertical: spacingY._20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 10
    },
    row: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    divider: {
        height: 1,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: colors.neutral200,
    }
})