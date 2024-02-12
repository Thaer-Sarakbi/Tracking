import React, { useEffect, useState } from 'react';
import { Text, View, LogBox, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StyleSheet, Keyboard } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import { Colors } from '../assets/Colors';
import ImageView from "react-native-image-viewing";
import { RouteProp } from '@react-navigation/native';
import { RootStackParamsList } from '../navigation/AppStack';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore'
import Icon from 'react-native-vector-icons/Ionicons';
import { addNotification } from '../redux/notificationsSlice';
import LottieView from 'lottie-react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { deleteUpdate } from '../redux/updatesSlice';
import { AppDispatch } from '../redux/store';
import { User, message } from '../types/types';
import MapView, {Marker} from "react-native-maps";
import moment from 'moment';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  
interface Props {
  route: RouteProp<RootStackParamsList, "UpdateDetails">
  navigation: StackNavigationProp<RootStackParamsList, "UpdateDetails">
}
 
interface MyState {
  auth: {user: User}
}

const AttendanceDetailsScreen = ({ route, navigation } : Props) => {
    console.log(route.params.checkIn)
//   const user = useSelector((state: MyState) => state.auth.user)

  const time = route.params.checkIn?.time
  const latitude = route.params.checkIn?.latitude
  const longitude = route.params.checkIn?.longitude
  const note = route.params.checkIn?.note

  const checkOutTime = route.params.checkOut?.time
  const checkOutLatitude = route.params.checkOut?.latitude
  const checkOutLongitude = route.params.checkOut?.longitude
  const checkOutNote = route.params.checkOut?.note
 
  if(route){
    return (
        <ScrollView style={{ marginBottom: 60, flex: 1 }}>
          <View style={{ backgroundColor: Colors.main, width: '100%', height: 50, justifyContent: 'space-between', paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-outline" size={35} color={'white'} />
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: 'white', margin: 10, borderRadius: 10, padding: 10 }}>
            <Text style={{ fontSize: 30, color: Colors.titles, fontWeight: 'bold' }}>Check In</Text>
            {time && (<><Text style={{ fontSize: 20, color: Colors.titles, fontWeight: 'bold' }}>Time:</Text>
            <Text>{moment(time).format('h:mm a')}</Text>

            <Text style={{ fontSize: 20, color: Colors.titles, fontWeight: 'bold', marginTop: 10 }}>Note:</Text>
            <Text>{note}</Text>

            <Text style={{ fontSize: 20, color: Colors.titles, fontWeight: 'bold', marginTop: 10 }}>Location:</Text>
            <MapView
            style={{ width: '100%', height: 300, marginVertical: 10, borderRadius: 5 }}
                initialRegion={{
                longitude: longitude ? Number(longitude) : 0,
                latitude: latitude ? Number(latitude) : 0,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                }}
            >
            <Marker
                coordinate={{
                longitude: longitude ? Number(longitude) : 0,
                latitude: latitude ? Number(latitude) : 0
                }}
                pinColor={"red"}
            />
            </MapView></>)}
        </View>

        <View style={{ backgroundColor: 'white', margin: 10, borderRadius: 10, padding: 10 }}>
            <Text style={{ fontSize: 30, color: Colors.titles, fontWeight: 'bold' }}>Check Out</Text>
            {checkOutTime && (<><Text style={{ fontSize: 20, color: Colors.titles, fontWeight: 'bold' }}>Time:</Text>
            <Text>{moment(checkOutTime).format('h:mm a')}</Text>

            <Text style={{ fontSize: 20, color: Colors.titles, fontWeight: 'bold', marginTop: 10 }}>Note:</Text>
            <Text>{checkOutNote}</Text>

            <Text style={{ fontSize: 20, color: Colors.titles, fontWeight: 'bold', marginTop: 10 }}>Location:</Text>
            <MapView
            style={{ width: '100%', height: 300, marginVertical: 10, borderRadius: 5 }}
                initialRegion={{
                longitude: checkOutLongitude ? Number(checkOutLongitude) : 0,
                latitude: checkOutLatitude ? Number(checkOutLatitude) : 0,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                }}
            >
            <Marker
                coordinate={{
                longitude: checkOutLongitude ? Number(checkOutLongitude) : 0,
                latitude: checkOutLatitude ? Number(checkOutLatitude) : 0
                }}
                pinColor={"red"}
            />
            </MapView></>)}
        </View>
        </ScrollView>
      );
  } else {
    return(
      <>
        <LottieView source={require("../assets/loading2.json")} style={{flex: 1}} autoPlay loop />
      </>
    )
  }
}

export default AttendanceDetailsScreen;