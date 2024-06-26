import React, { useState } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Platform} from 'react-native';
import auth from '@react-native-firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient'
import { Colors } from '../assets/Colors';
import { useForm, Controller } from "react-hook-form"
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamsList } from '../navigation/AuthStack';
import packageJson from '../../package.json';
import useShowPassword from '../hooks/useShowPassword';
import firestore from '@react-native-firebase/firestore'

const Login = ({ navigation } : StackScreenProps<AuthStackParamsList, 'Login'>) => {

  const [backendError, setBackendError] = useState('')

  const { showPassword, toggleShowPassword } = useShowPassword() 

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })
  
  const findDocumentByEmail = async (email: string, password: string) => {
    try {
        const snapshot = await firestore()
            .collection('users')
            .where('email', '==', email)
            .get();

            if(password !== snapshot.docs[0].data().password){
              await firestore()
              .collection('users')
              .doc(snapshot.docs[0].id)
              .update({
                password
              })
              .then(() => {
                console.log('updated')
              }).catch((e) => {
                console.log(e)
              });
            }

        if (snapshot.empty) {
            console.log('No matching documents.');
            return null;
        }

        // Assuming there's only one document matching the email
        // You can loop through snapshot.docs if you expect multiple documents
        const document = snapshot.docs[0].data();
        return document;
    } catch (error) {
        console.log('Error finding document by email:', error);
        return null;
    }
};

  const onSubmit = async() => {
    const { email, password } = watch()

    await auth().signInWithEmailAndPassword(email, password).then((res) => {
      findDocumentByEmail(email, password)
    }).catch((e) => {
      setBackendError(e.code)
      console.log(e.code)
    })
  }

  return (
    <View style={styles.container}> 
      <StatusBar backgroundColor= {Colors.main} barStyle='light-content' />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>
      <Animatable.View style={styles.footer} animation='fadeInUpBig'>
        <Text style={styles.text_footer}>Email</Text>
        <View style={styles.action}>
          <FontAwesome name='user-o' color='#05375a' size={20} />
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Email is required'
              },
              pattern:{
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email address"
              } 
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput 
                placeholder='Your Email' 
                style={styles.textInput} 
                autoCapitalize='none'  
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="email"
          />
         
        </View>
        {errors.email && <Text style={{ color: 'red', fontSize: 15 }}>{errors.email?.message}</Text>} 
       
        <Text style={[styles.text_footer,{marginTop: 35}]}>Password</Text>
        <View style={styles.action}>
          <FontAwesome name='lock' color='#05375a' size={20} />
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Password is required'
              },
              minLength: {
                value: 8,
                message: 'Your Password is too short'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput 
                placeholder='Your Password' 
                style={styles.textInput} 
                autoCapitalize='none'  
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showPassword} 
              />
            )}
            name="password"
          />

            <MaterialIcons 
              name={showPassword ? 'visibility-off' : 'visibility'} 
              size={25} 
              color="#aaa"
              style={{marginRight: 10}} 
              onPress={toggleShowPassword} 
            /> 
        </View>
        {errors.password && <Text style={{ color: 'red', fontSize: 15 }}>{errors.password?.message}</Text>}
        <TouchableOpacity style={{ marginTop: 10 }} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text>Forgot my password</Text>
        </TouchableOpacity>
        

        <Text style={{ color: 'red', fontSize: 15 }}>{backendError}</Text>

        <View style={styles.button}>
          
            <LinearGradient colors={['#FF8A65', Colors.main]} style={styles.signIn}>
              <TouchableOpacity style={{  width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={handleSubmit(onSubmit)}>
                <Text style={[styles.textSign, { color: '#fff' }]}>Sign In</Text>
              </TouchableOpacity>
            </LinearGradient>

          <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={[styles.signIn, { borderColor: Colors.main, borderWidth: 1, marginTop: 15 }]}>
            <Text style={[styles.textSign, { color: Colors.main }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ alignSelf: 'center', fontSize: 15, marginVertical: 10 }}>version: {packageJson.version}</Text>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: Colors.main
  },
  header: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 50
  },
  footer: {
      flex: 3,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 30
  },
  text_header: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 30
  },
  text_footer: {
      color: '#05375a',
      fontSize: 18
  },
  action: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5
  },
  actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5
  },
  textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 10,
      color: '#05375a',
  },
  errorMsg: {
      color: '#FF0000',
      fontSize: 14,
  },
  button: {
      alignItems: 'center',
      marginTop: 50
  },
  signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
  },
  textSign: {
      fontSize: 18,
      fontWeight: 'bold'
  }
});

export default Login;