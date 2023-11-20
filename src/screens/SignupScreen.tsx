import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput, Image, TouchableOpacity, Platform, StatusBar, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import * as Animatable from 'react-native-animatable'
import { useForm, Controller } from "react-hook-form"
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsList } from '../AppStack';

const SignUpScreen = ({ navigation } : StackScreenProps<RootStackParamsList, 'Signup'>) => {

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
          firstName: "",
          secondName: ""
        },
    })

    const onSubmit = (data) => console.log(data)
    
    console.log(errors)

  return ( 
    <View style={styles.container}> 
      <StatusBar backgroundColor='#FF5722' barStyle='light-content' />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>
      
      <Animatable.View style={styles.footer} animation='fadeInUpBig'>
       <ScrollView>
       <Text style={styles.text_footer}>First Name</Text>
        <View style={styles.action}>
          <FontAwesome name='user-o' color='#05375a' size={20} />
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'First Name is required'
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput 
                placeholder='First Name' 
                style={styles.textInput} 
                autoCapitalize='none'  
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="firstName"
          />
        </View>
        {errors.firstName && <Text style={{ color: 'red', fontSize: 15 }}>{errors.firstName.message}</Text>}

        <Text style={styles.text_footer}>Second Name</Text>
        <View style={styles.action}>
          <FontAwesome name='user-o' color='#05375a' size={20} />
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Second Name is required'
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput 
                placeholder='Second Name' 
                style={styles.textInput} 
                autoCapitalize='none'  
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="secondName"
          />
        </View>
        {errors.secondName && <Text style={{ color: 'red', fontSize: 15 }}>{errors.secondName.message}</Text>}

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