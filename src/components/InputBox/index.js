import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from 'react';
import {Auth, API, graphqlOperation} from 'aws-amplify'
import { createMessage, updateChatRoom } from '../../graphql/mutations';

const InputBox = ({chatroom}) => {

    const [text, setText] = useState('');

    const onSend = async () => {
       // console.warn("Send a new message");

        const authUser = await Auth.currentAuthenticatedUser()

        const newMessage = {
          chatroomID: chatroom.id, 
          userID: authUser.attributes.sub,
          text
        }

        const newMessageData = await API.graphql(graphqlOperation(createMessage,{input:newMessage}))

        setText("");

        //set new msg as last msg

        await API.graphql(graphqlOperation(updateChatRoom,
          {input:{chatRoomLastMessageId: newMessageData.data.createMessage.id, 
            id: chatroom.id, 
            _version: chatroom._version}}))
      };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <AntDesign name="plus" size={24} color="#90ced6" />
      <TextInput value={text} placeholder="Type your message..."
        onChangeText={setText}
        multiline
        style={styles.input} />
      <MaterialIcons onPress={onSend} style={styles.send} name="send" size={24} color="white" />
    </SafeAreaView>
  )
}

export default InputBox

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "whitesmoke",
        padding: 5,
        alignItems: "center",
      },
      input: {
        fontSize: 18,
    
        flex: 1,
        backgroundColor: "white",
        padding: 5,
        paddingHorizontal: 10,
        marginHorizontal: 10,
    
        borderRadius: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "lightgray",
      },
      send: {
        backgroundColor: "#90ced6",
        padding: 7,
        borderRadius: 15,
        overflow: "hidden",
      },
})