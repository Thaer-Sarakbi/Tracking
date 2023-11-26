import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AuthStack from './navigation/AuthStack';
import AppStack from './AppStack';
import onAuthStateChanged from '@react-native-firebase/auth';
import firestore, { firebase } from '@react-native-firebase/firestore'
import { AppDispatch } from './redux/store';
import { setUser } from './redux/authSlice';
import { LogBox } from 'react-native';

// LogBox.ignoreLogs([
//     'Non-serializable values were found in the navigation state',
// ]);

const AppContainer = () => {
    const user = useSelector(state => state.auth.user)
    console.log('user', JSON.stringify(user))

    const dispatch = useDispatch<AppDispatch>()
   
    useEffect(() => {
        firebase.auth().onAuthStateChanged(u => {
            // console.log(u)
            dispatch(setUser(u))
        })
    },[])

    if(user){
       return(
         <AppStack/>
       ) 
    } else {
       return(
         <AuthStack />
       )
    }

  }
  
  export default AppContainer