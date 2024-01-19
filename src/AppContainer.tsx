import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';
import { firebase } from '@react-native-firebase/firestore'
import { AppDispatch } from './redux/store';
import { setUser } from './redux/authSlice';

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