import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import { Colors } from '../assets/Colors';
import { useForm, Controller } from "react-hook-form"
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamsList } from '../navigation/AuthStack';
import AwesomeAlert from 'react-native-awesome-alerts';
import Icon from 'react-native-vector-icons/Ionicons';

const ForgotPassword = ({ navigation } : StackScreenProps<AuthStackParamsList, 'ForgotPassword'>) => {

    const [message, setMessage] = useState('')
    const [showAlert, setShowAlert] = useState(false)
  
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        resetField
    } = useForm({
        defaultValues: {
          email: ""
        },
    })

    const onSubmit = async () => {
        const { email } = watch()
  
        await auth().sendPasswordResetEmail(email)
        .then((res) => {
            setShowAlert(true)
            setMessage('Check Your Email')
            resetField('email')
        })
        .catch(error => {
          setShowAlert(true)
          setMessage(error.code);
          resetField('email')
        });
      }

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity  onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={35} color={'white'} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 10 }}>
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

            <View style={styles.button}>
            <LinearGradient colors={['#FF8A65', '#FF5722']} style={styles.signIn}>
                <TouchableOpacity style={{  width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={handleSubmit(onSubmit)}>
                <Text style={[styles.textSign, { color: '#fff' }]}>Reset</Text>
                </TouchableOpacity>
            </LinearGradient>
            </View>


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
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header:{ 
        backgroundColor: Colors.main, 
        width: '100%', 
        height: 50, 
        justifyContent: 'space-between', 
        paddingLeft: 10, 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderWidth: 1,
        paddingBottom: 5,
        borderRadius: 10,
        alignItems: 'center',
        paddingHorizontal: 10
    },
    button: {
        alignItems: 'center',
        marginTop: 10
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
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        color: '#05375a',
        fontSize: 17,
        alignSelf: 'flex-end'
    },
});

export default ForgotPassword;