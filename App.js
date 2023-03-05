import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigator from './src/navigation/index';
import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import awsconfig from './src/aws-exports'
import { withAuthenticator } from 'aws-amplify-react-native';
import { useEffect } from 'react';
import { getUser } from './src/graphql/queries';
import {createUser} from './src/graphql/mutations';

Amplify.configure({ ...awsconfig, Analytics: { disabled: true } });

function App() {

  useEffect(()=>{
    const syncUser = async () => {
      // get auth user
      const authUser = await Auth.currentAuthenticatedUser({bypassCache:true})

      //query db using auth sub id
      const userData = await API.graphql(graphqlOperation(getUser,{id:authUser.attributes.sub}))

      if(userData.data.getUser){
        console.log("user exists in db")
        return;
      }

      //if no users create one
      const newUser = {
        id:authUser.attributes.sub,
        name:authUser.attributes.phone_number,
        status:"Hey there!"
      }
      const newUserResponse = await API.graphql(graphqlOperation(createUser,{input:newUser}))
    }

    syncUser()
  },[])

  return (
    <View style={styles.container}>
      
    
      <Navigator/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
   // alignItems: 'center',
    justifyContent: 'center',
    //paddingVertical:50
  },
});

export default withAuthenticator(App);