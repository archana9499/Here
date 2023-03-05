import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import chats from "../../assets/data/chats.json";
import ChatListItem from '../components/ChatListItem/index';
import ContactListItem from '../components/ContactListItem/index';
import { API, graphqlOperation } from "aws-amplify";
import { listUsers } from "../graphql/queries";

const ContactsScreen = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
	  API.graphql(graphqlOperation(listUsers)).then((result) => {
	    setUsers(result.data?.listUsers?.items);
	  });
	}, []);

  return (
  
      <FlatList data={users}
        renderItem={({item})=> <ContactListItem user={item}/>}/>

  )
}

export default ContactsScreen

const styles = StyleSheet.create({})