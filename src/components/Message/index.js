import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {API,graphqlOperation, Auth} from 'aws-amplify'
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Message = ({message}) => {

  const [isMe, setIsMe] = useState(false)

  useEffect(()=>{

    const isMyMessage = async () => {

      const authUser = await Auth.currentAuthenticatedUser()
         setIsMe(message.userID === authUser.attributes.sub);
    }
    isMyMessage()
  },[])

    
  return (
    <View style={[
        styles.container,
        {
          backgroundColor: isMe ? "#90ced6" : "white",
          alignSelf: isMe ? "flex-end" : "flex-start",
        },
      ]}>
      <Text >{message.text}</Text>
      <Text style={styles.time}>{dayjs(message.createdAt).fromNow()}</Text>
    </View>
  )
}

//#90ced6

export default Message

const styles = StyleSheet.create({
    container: {
        margin: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: "80%",
    
            // Shadows
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
    
        elevation: 1,
      },
      message: {},
      time: {
        alignSelf: "flex-end",
        color: "grey",
      },
})