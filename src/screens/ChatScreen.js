import { StyleSheet, Text, View, ImageBackground, FlatList, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import bg from "../../assets/images/BG.png";
import messages from "../../assets/data/messages.json";
import Message from '../components/Message/index';
import InputBox from '../components/InputBox/index';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API,graphqlOperation,Auth } from 'aws-amplify';
import { getChatRoom,listMessagesByChatRoom } from '../graphql/queries';
import {onCreateMessage, onUpdateChatRoom} from '../graphql/subscriptions'

const ChatScreen = () => {

  const [chatRoom,setChatRoom] = useState(null)
  const [messages, setMessages] = useState([])

  const navigation = useNavigation();
  const route = useRoute();

  const chatroomID = route.params.id

  //fetch chatroom

  useEffect(()=>{
    API.graphql(graphqlOperation(getChatRoom,{id:chatroomID}))
    .then((result)=>setChatRoom(result.data?.getChatRoom)
    )

     // Subscribe to onUpdateChatRoom
  const subscription = API.graphql(
    graphqlOperation(onUpdateChatRoom, {
      filter: { id: { eq: chatroomID } },
    })
  ).subscribe({
    next: ({ value }) => {
      setChatRoom((cr) => ({
        ...(cr || {}),
        ...value.data.onUpdateChatRoom,
      }));
    },
    error: (error) => console.warn(error),
  });

  // Stop receiving data updates from the subscription
  return () => subscription.unsubscribe();


  },[chatroomID])

   //fetch msg
   useEffect(()=>{
    API.graphql(graphqlOperation(listMessagesByChatRoom,{chatroomID, sortDirection: "DESC"}))
    .then((result)=>{
    setMessages(result.data?.listMessagesByChatRoom?.items)})

    //subscribe to new msg
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage, {filter: {chatroomID: {eq:chatroomID}}})
    ).subscribe({
      next: ({ value }) => {
        setMessages((m) => [value.data.onCreateMessage, ...m]);
      },
      error: (error) => console.warn(error),
    });
    
    // Stop receiving data updates from the subscription
    return () => subscription.unsubscribe();

   },[chatroomID])


  useEffect(() => {
    navigation.setOptions({ title: route.params.name });
  }, [route.params.name]);

  if(!chatRoom){
    return <ActivityIndicator/>
  }

  return (

    <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 90} behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.bg}>
    <ImageBackground source={bg} style={styles.bg}>
      <FlatList inverted style={styles.list} data={messages} renderItem={({item})=> <Message message={item}/>}/>
        <InputBox chatroom={chatRoom}/>
    </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
    bg:{
        flex: 1,
    },
    list:{
        padding:10
    }
})