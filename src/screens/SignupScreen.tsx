import React, { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput, Image, TouchableOpacity, Platform, StatusBar, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import * as Animatable from 'react-native-animatable'
import { useForm, Controller } from "react-hook-form"
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AppStack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import { User } from '../types/types';
import { Colors } from '../assets/Colors';
import AwesomeAlert from 'react-native-awesome-alerts';
import { AuthStackParamsList } from '../navigation/AuthStack';

const SignUpScreen = ({ navigation } : StackScreenProps<AuthStackParamsList, 'Signup'>) => {

  const [message, setMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    if(message !== ''){
      setShowAlert(true)
    }
  },[message])

  const {
        control,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm({
        defaultValues: {
          email: "",
          password: "",
          confirmPassword: "",
          name: ""
        },
    })

    const onSubmit = async () => {
      const { email, password, name } = watch()

      await auth().createUserWithEmailAndPassword(email, password).then((res) => {
        setMessage('User account created!');
        firestore().collection('users').add({
          name: name,
          email: email,
          admin: false
        }).then(() => {
          console.log('User Added')
        }).catch((e) => {
          console.log(e)
        })
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          setMessage('That email address is already in use!');
        }
    
        if (error.code === 'auth/invalid-email') {
          setMessage('That email address is invalid!');
        }
      });
    }

  return ( 
    <View style={styles.container}> 
      <StatusBar backgroundColor='#FF5722' barStyle='light-content' />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>
      
      <Animatable.View style={styles.footer} animation='fadeInUpBig'>
       <ScrollView>
       <Text style={styles.text_footer}>Name</Text>
        <View style={styles.action}>
          <FontAwesome name='user-o' color='#05375a' size={20} />
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Name is required'
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput 
                placeholder='Name' 
                style={styles.textInput} 
                autoCapitalize='none'  
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="name"
          />
        </View>
        {errors.name && <Text style={{ color: 'red', fontSize: 15 }}>{errors.name.message}</Text>}

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
                message: "Invalid email address"
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
                secureTextEntry={true}
              />
            )}
            name="password"
          />      
        </View>
        {errors.password && <Text style={{ color: 'red', fontSize: 15 }}>{errors.password?.message}</Text>}

        <Text style={[styles.text_footer,{marginTop: 35}]}>Confirm Password</Text>
        <View style={styles.action}>
          <FontAwesome name='lock' color='#05375a' size={20} />

          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Password is required'
              },
              validate: (val: string) => {
                if (watch('password') != val) {
                  return "Your passwords doesn't match";
                }
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput 
                placeholder='Confirm Your Password' 
                style={styles.textInput} 
                autoCapitalize='none'  
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={true}
              />
            )}
            name="confirmPassword"
          />     
        </View>
        {errors.confirmPassword && <Text style={{ color: 'red', fontSize: 15 }}>{errors.confirmPassword?.message}</Text>}

        <View style={styles.button}>
          <LinearGradient colors={['#FF8A65', '#FF5722']} style={styles.signIn}>
            <TouchableOpacity onPress={handleSubmit(onSubmit)}>
              <Text style={[styles.textSign, { color: '#fff' }]}>Sign Up</Text>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.signIn, { borderColor: '#FF5722', borderWidth: 1, marginTop: 15 }]}>
            <Text style={[styles.textSign, { color: '#FF5722' }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
       </ScrollView>
      </Animatable.View>

      <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Alert"
          message= {message}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          // showConfirmButton={true}
          cancelText="OK"
          // confirmText="Yes"
          confirmButtonColor= {Colors.main}
          onCancelPressed={() => {
            setShowAlert(false)
          }}
          contentContainerStyle={{
            width: '70%'
          }}
          titleStyle={{
            fontSize: 30,
            fontWeight: 'bold'
          }}
          messageStyle={{
            fontSize: 20,
          }}
          confirmButtonStyle={{
            width: 60,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          cancelButtonStyle={{
            width: 60,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          confirmButtonTextStyle={{
            fontSize: 15
          }}
          cancelButtonTextStyle={{
            fontSize: 15
          }}
        />
     
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#FF5722'
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
      fontSize: 17
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

export default SignUpScreen