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

interface AppContainerState {
  auth: {user: User}
}

const AppContainer = () => {
  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  // const user = useSelector((state: TasksState) => state.auth.user)
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  // console.log(user)

    const dispatch = useDispatch<AppDispatch>()
   
    useEffect(() => {
        firebase.auth().onAuthStateChanged(u => {
            dispatch(setUser(u))
            setCurrentUser(u)
        })

        const listenToNotifications = () => {
          try {
            getFCMToken();
            requestUserPermission();
            onNotificationOpenedAppFromQuit();
            listenToBackgroundNotifications();
            listenToForegroundNotifications();
            onNotificationOpenedAppFromBackground();
          } catch (error) {
            console.log(error);
          }
        };
    
        listenToNotifications();
    },[])

    const refreshToken = async() => {
      const token = await messaging().getToken()

    // await firestore()
    //   .collection('users')
    //   .doc(user.id)
    //   .update({
    //     deviceToken: token
    //   })
    //   .then(() => {
    //     console.log('updated')
    //   }).catch((e) => {
    //     console.log(e)
    //   });
    }
    
    if(currentUser){
      refreshToken()
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