import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
// import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore'
import { Colors } from '../assets/Colors';
import { SelectList } from 'react-native-dropdown-select-list'
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../types/types';
import { AppDispatch } from '../redux/store';
import { getUsers } from '../redux/usersSlice';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';
import { getTasks } from '../redux/tasksSlice';

interface MyState {
    users: {data: Array<User>},
    auth: {user: User}
}

interface Props {
  changeModalVisible: (boole: boolean) => void
}

const NewTaskModal = ({ changeModalVisible }: Props) => {

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      title: "",
      decription: "",
      assignedTo: "",
      duration: "",
      location: "",
    },
  })

  const users = useSelector((state: MyState) => state.users.data)
  const user = useSelector((state: MyState) => state.auth.user)

  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = async () => {
    const { title, decription, assignedTo, duration, location } = watch()

  await firestore().collection('users').doc(user.id).collection('tasks').add({
    title, 
    decription, 
    assignedTo, 
    duration, 
    location,
    status: 'Not Started',
    creationDate: new Date()
  }).then(res => {
    changeModalVisible(false)
    dispatch(getTasks(user.id))
  }).catch(err => {
    changeModalVisible(false)
    console.log(err)
  })
  }

const getLocation = () => {
//   Geolocation.getCurrentPosition(info => {
//     setLatitude(info.coords.altitude)
//     setLongitude(info.coords.longitude)
//   }, (err) => {
//       RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
//         interval: 10000,
//         fastInterval: 5000,
//       })
//         .then((data) => {
//           getLocation()
//         })
//         .catch((err) => {
          
//         });
//   }); 
}

  useEffect(() => {
    dispatch(getUsers())
  },[])

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => changeModalVisible(false)} style = {{ backgroundColor: '#BDBDBD', width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 50, position: 'absolute', right: 10, top: 10, zIndex: 1 }}>
        <Icon name='close-outline' color={'#fff'} size = {30} />
      </TouchableOpacity>

      <View style = {{ height: 40 }} />

      <Text style = {{ fontSize: 20, color: Colors.titles }}>Task Title</Text>
      <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Title is required'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => {
             return(
              <TextInput
                autoCapitalize='none'  
                style= {{ color: '#fff', width: '100%', height: 50, backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}}
            name="title"
          />
      {errors.title && <Text style={{ color: 'red', fontSize: 15 }}>{errors.title?.message}</Text>}

      <Text style = {{ fontSize: 20, color: Colors.titles, marginTop: 20 }}>Description</Text>

      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Decription is required'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style= {{  marginRight: 10, color: '#fff', backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
            editable
            multiline
            numberOfLines={5}
            textAlignVertical='top'
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
            )}
            name="decription"
          />
      {errors.decription && <Text style={{ color: 'red', fontSize: 15 }}>{errors.decription?.message}</Text>}

      <Text style = {{ fontSize: 20, color: Colors.titles, marginTop: 20 }}>Assign To</Text>

      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'This feild is required'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <SelectList 
            setSelected={onChange} 
            data={users} 
            save="value"
            // value={value}
          />
            )}
            name="assignedTo"
        />
      {errors.assignedTo && <Text style={{ color: 'red', fontSize: 15 }}>{errors.assignedTo?.message}</Text>}

      <Text style = {{ fontSize: 20, color: Colors.titles, marginTop: 20 }}>Duration</Text>
      <View style = {{ flexDirection: 'row', alignItems: 'center' }}>
        {/* <TextInput
          style= {{  marginRight: 10, color: '#fff', width: '40%', height: 50, backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
          onChangeText={(text) => setDuration(text)}
          keyboardType="numeric"
        /> */}

      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Duration is required'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style= {{  marginRight: 10, color: '#fff', width: '40%', height: 50, backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
            keyboardType="numeric"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
            )}
            name="duration"
          />
        <Text style = {{ fontSize: 15, color: Colors.texts }}>Days</Text>
      </View>
      {errors.duration && <Text style={{ color: 'red', fontSize: 15 }}>{errors.duration?.message}</Text>}

      <Text style = {{ fontSize: 20, color: Colors.titles, marginTop: 20 }}>Location</Text>
      {/* <TextInput
        style= {{  marginRight: 10, color: '#fff', width: '40%', height: 50, backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
        onChangeText={(text) => setLocation(text)}
      /> */}

      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Location is required'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style= {{  marginRight: 10, color: '#fff', width: '40%', height: 50, backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
            )}
            name="location"
          />
           {errors.location && <Text style={{ color: 'red', fontSize: 15 }}>{errors.location?.message}</Text>}

      <TouchableOpacity onPress={handleSubmit(onSubmit)} style = {{ width: '100%', backgroundColor: Colors.main, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginVertical: 20 }}>
        <Text style = {{ color: 'white', fontSize: 20 }}>Proceed</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
    paddingBottom: 50
  },
  touchableOpacity: {
    paddingVertical: 10,
    alignItems: 'center'
  },
  text: {
    margin: 5,
    fontSize: 16,
    fontWeight: 'bold'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})

export default NewTaskModal