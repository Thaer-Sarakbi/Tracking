import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';
import { firebase } from '@react-native-firebase/firestore'
import { AppDispatch } from './redux/store';
import { setUser } from './redux/authSlice';
import { User } from './types/types';

interface AppContainerState {
  auth: {user: User}
}

const AppContainer = () => {
    const user = useSelector((state: AppContainerState) => state.auth.user)
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