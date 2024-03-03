import React from 'react';
import { Text, View, LogBox, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../assets/Colors';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamsList } from '../navigation/AppStack';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import MapViewComponent from '../components/MapView';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  
interface Props {
  route: RouteProp<RootStackParamsList, "AttendanceDetails">
  navigation: StackNavigationProp<RootStackParamsList, "AttendanceDetails">
}

const AttendanceDetailsScreen = ({ route, navigation } : Props) => {

  const time = route.params.checkIn.time
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
            {time && (
            <>
              <Text style={{ fontSize: 20, color: Colors.titles, fontWeight: 'bold' }}>Time:</Text>
              <Text>{moment(time).format('h:mm a')}</Text>

              <Text style={{ fontSize: 20, color: Colors.titles, fontWeight: 'bold', marginTop: 10 }}>Note:</Text>
              <Text>{note}</Text>

              <Text style={{ fontSize: 20, color: Colors.titles, fontWeight: 'bold', marginTop: 10 }}>Location:</Text>
              <MapViewComponent longitude={longitude} latitude={latitude}/>
            </>)}
        </View>

        <View style={{ backgroundColor: 'white', margin: 10, borderRadius: 10, padding: 10 }}>
            <Text style={{ fontSize: 30, color: Colors.titles, fontWeight: 'bold' }}>Check Out</Text>
            {checkOutTime && (
            <>
              <Text style={{ fontSize: 20, color: Colors.titles, fontWeight: 'bold' }}>Time:</Text>
              <Text>{moment(checkOutTime).format('h:mm a')}</Text>

              <Text style={{ fontSize: 20, color: Colors.titles, fontWeight: 'bold', marginTop: 10 }}>Note:</Text>
              <Text>{checkOutNote}</Text>

              <Text style={{ fontSize: 20, color: Colors.titles, fontWeight: 'bold', marginTop: 10 }}>Location:</Text>
              <MapViewComponent longitude={checkOutLongitude} latitude={checkOutLatitude}/>
            </>)}
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