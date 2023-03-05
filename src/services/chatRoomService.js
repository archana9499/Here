import { API,graphqlOperation, Auth } from "aws-amplify"

export const getCommonChatRoomWithUser = async (userID) => {

    const authUser = await Auth.currentAuthenticatedUser()
    //get all chatroom of user1
    const response = await API.graphql(graphqlOperation(listChatRooms,{id:authUser.attributes.sub}))
     const chatRooms = response.data?.getUser?.ChatRooms.items || []

    const chatRoom = chatRooms.find((chatRoomItem) => 
    {
        return chatRoomItem.chatRoom.users.items.some((userItem) => userItem.user.id === userID)
    })

    return chatRoom
    //get all chatroom of user2

    //remove chatroom with more than 2 users

    //get common chatrooms
}

export const listChatRooms =  /* GraphQL */`
query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      ChatRooms {
        items {
          chatRoom {
            id
            users {
              items {
                user {
                  id
            
                }
              }
            }
            
          }
        }
      }
    }
  }
  `