import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
// import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../assets/Colors';
// import Geolocation from '@react-native-community/geolocation';
// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

interface Props {
  changeModalVisible: (boole: boolean) => void
}

const NewTaskModal = ({ changeModalVisible }: Props) => {
  const [title, setTitle] = useState<string>()
  const [decription, setDecription] = useState<string>()
  const [assignTo, setAssignTo] = useState<string>()
  const [duration, setDuration] = useState<string>()
  const [location, setLocation] = useState<string>()

  const submit = async() => {
    // await firestore().collection('cars').add({
    //   name,
    //   price,
    //   priceBefore,
    //   image,
    //   fuel,
    //   distance,
    //   per,
    //   status: 'active',
    //   latitude: Number(latitude),
    //   longitude: Number(latitude)
    // }).then(res => {
    //   changeModalVisible(false)
    // }).catch(err => {
    //   changeModalVisible(false)
    // })

    changeModalVisible(false)
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
      <TextInput
        style= {{  marginRight: 10, color: '#fff', width: '40%', height: 50, backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
        onChangeText={(text) => setAssignTo(text)}
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
    paddingHorizontal: 10
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