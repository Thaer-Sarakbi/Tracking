import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {StyleSheet, Text, View, TextInput, Button, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';

const Login = ({ navigation }) => {

   const doLogin = () => {
    auth().signInWithEmailAndPassword('thaer92.41@gmail.com', 'football12.34')
    .then(() => {
      console.log('User account created & signed in!');
      navigation.navigate('BottomTab')
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }
  
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
  
      console.error(error);
    });
   }


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => doLogin()}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;