import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import {API, graphqlOperation, Auth} from 'aws-amplify'
import { createChatRoom, createUserChatRoom } from "../../graphql/mutations";
import {getCommonChatRoomWithUser} from '../../services/chatRoomService'
import dayjs from "dayjs"; 
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigation } from "@react-navigation/native";
dayjs.extend(relativeTime);



const ContactListItem = ({user}) => {

  const navigation = useNavigation();

  const onPress = async () => {
    console.warn("Pressed!")


    // check  if there's already a chtaroom with user

    const existingChatRoom = await getCommonChatRoomWithUser(user.id)
    if(existingChatRoom){
      navigation.navigate("Chat",{id:existingChatRoom.id})
      return;
    }


    //create a chatroom
    const newChatRoomData = await API.graphql(graphqlOperation(createChatRoom,{input:{}}))
    console.log(newChatRoomData)

    if(!newChatRoomData.data?.createChatRoom){
      console.log("error creating chatroom")
    }
    const newChatRoom = newChatRoomData.data?.createChatRoom

    //add clicked user to chatroom
    await API.graphql(graphqlOperation(createUserChatRoom,{input:{chatRoomId: newChatRoom.id, userId: user.id}}))

    //add auth user to chatroom
    const authUser = await Auth.currentAuthenticatedUser()
    await API.graphql(graphqlOperation(createUserChatRoom,{input:{chatRoomId: newChatRoom.id, userId: authUser.attributes.sub}}))

    // navigate to newly created chatroom
    navigation.navigate("Chat",{id:newChatRoom.id})
  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
			{/* User Avatar */}
      <Image
        source={{
          uri: user.image,
        }}
        style={styles.image}
      />

			{/* Content Container */}
        <View style={styles.content}>

     
            <Text numberOfLines={1} style={styles.name}>{user.name}</Text>

            <Text style={styles.subTitle} numberOfLines={2} >{user.status}</Text>
		     
          </View>

      
    
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    height:60,
    
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
    borderBottomColor: "lightgray",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  name: {
    fontWeight: "bold",
    flex: 1,
  },
  subTitle: {
    color: "grey",
  },
});



export default ContactListItem;

