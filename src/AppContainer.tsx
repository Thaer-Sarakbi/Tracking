import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';
import { firebase } from '@react-native-firebase/firestore'
import { AppDispatch } from './redux/store';
import { setUser } from './redux/authSlice';
import { User } from './types/types';
import usePushNotification from './hooks/usePushNotification';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore'

const AppContainer = () => {

  const [currentUser, setCurrentUser] = useState<any | null>(null)

    const dispatch = useDispatch<AppDispatch>()
   
    useEffect(() => {
        firebase.auth().onAuthStateChanged(u => {
            dispatch(setUser(u))
            setCurrentUser(u)
        })
    },[])
    
    if(currentUser){
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