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
import { getTasks } from '../redux/tasksSlice';
import moment from 'moment';
// import Geolocation from '@react-native-community/geolocation';
// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

interface MyState {
    users: {data: Array<User>}
}

interface Props {
  changeModalVisible: (boole: boolean) => void
}

const NewTaskModal = ({ changeModalVisible }: Props) => {
  const [title, setTitle] = useState<string>()
  const [decription, setDecription] = useState<string>()
  const [assignedTo, setAssignedTo] = useState<string>()
  const [duration, setDuration] = useState<string>()
  const [location, setLocation] = useState<string>()

  const users = useSelector((state: MyState) => state.users.data)

  const dispatch = useDispatch<AppDispatch>()

  const submit = async () => {

  await firestore().collection('users').doc('ArBP1hNGf2ScyBjdiDfE').collection('tasks').add({
    title, 
    decription, 
    assignedTo, 
    duration, 
    location,
    status: 'Not Started',
    creationDate: moment().format('MMM Do YYYY, hh:mm a')
  }).then(res => {
    changeModalVisible(false)
    dispatch(getTasks())
  }).catch(err => {
    changeModalVisible(false)
    console.log(err)
  })
    // dispatch(addTask(title, decription, assignTo, duration, location))
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
      <TextInput
        style= {{ color: '#fff', width: '100%', height: 50, backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
        onChangeText={(text) => setTitle(text)}
        placeholder=""
      />

      <Text style = {{ fontSize: 20, color: Colors.titles, marginTop: 20 }}>Description</Text>
      <TextInput
        style= {{  marginRight: 10, color: '#fff', backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
        onChangeText={(text) => setDecription(text)}
        editable
        multiline
        numberOfLines={5}
        textAlignVertical='top'
      />

      <Text style = {{ fontSize: 20, color: Colors.titles, marginTop: 20 }}>Assign To</Text>
      <SelectList 
        setSelected={(val: string) => setAssignedTo(val)} 
        data={users} 
        save="value"
    />

      <Text style = {{ fontSize: 20, color: Colors.titles, marginTop: 20 }}>Duration</Text>
      <View style = {{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style= {{  marginRight: 10, color: '#fff', width: '40%', height: 50, backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
          onChangeText={(text) => setDuration(text)}
          keyboardType="numeric"
        />
        <Text style = {{ fontSize: 15, color: Colors.texts }}>Days</Text>
      </View>

      <Text style = {{ fontSize: 20, color: Colors.titles, marginTop: 20 }}>Location</Text>
      <TextInput
        style= {{  marginRight: 10, color: '#fff', width: '40%', height: 50, backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
        onChangeText={(text) => setLocation(text)}
      />

      <TouchableOpacity onPress={() => submit()} style = {{ width: '100%', backgroundColor: Colors.main, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginVertical: 20 }}>
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