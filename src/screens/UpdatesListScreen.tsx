import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../assets/Colors';
import { RootStackParamsList } from '../navigation/AppStack';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import 'moment/locale/en-gb'
import firestore from '@react-native-firebase/firestore'
import { useSelector } from 'react-redux';
import Seperator from '../components/Seperator';

interface Props {
  route: RouteProp<RootStackParamsList, "UpdatesList">
  navigation: StackNavigationProp<RootStackParamsList, "UpdatesList">
}

const UpdatesListScreen = ({ route, navigation }: Props) => {
  const updatesList = route.params.updatesList
  const dailyReportsList = route.params.dailyReportsList
  const date = route.params.date

  const [checkIn, setCheckIn] = useState()
  const [checkOut, setCheckOut] = useState()
  console.log(checkIn)

  const user = useSelector((state: notificationsState) => state.auth.user)

  const retreiveCheckIn = async () => {
    await firestore().collection('users').doc(user.id).collection('checkIn').get()
    .then((res) => {
       res.docs.forEach(doc => {
        // console.log(moment(doc.data().time.seconds * 1000).format('L'), moment(date).format('L')) 
        if(moment(doc.data().time.seconds * 1000).format('L') === moment(date).format('L')){
          setCheckIn({
            ...doc.data(),
            time: new Date(doc.data().time.seconds * 1000)
          })
        }
       })
    })
  }

  const retreiveCheckOut = async () => {
    await firestore().collection('users').doc(user.id).collection('checkOut').get()
    .then((res) => {
       res.docs.forEach(doc => {
        if(moment(doc.data().time.seconds * 1000).format('L') === moment(date).format('L')){
          setCheckOut({
            ...doc.data(),
            time: new Date(doc.data().time.seconds * 1000)
          })
        }
       })
    })
  }

  useEffect(() => {
    retreiveCheckIn()
    retreiveCheckOut()
  },[])

  moment.locale('en-gb');        
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>{moment(date).format('L')}</Text>
      <Text style={{ fontSize: 19, color: Colors.titles, fontWeight: 'bold' }}>Attendance</Text>
      <TouchableOpacity onPress={() => navigation.navigate('AttendanceDetails', {
        checkIn,
        checkOut
      })} style={styles.card}>
        {checkIn && (<Text style={{ fontSize: 15 }}>Check In: {moment(checkIn?.time).format('h:mm a')}</Text>)}
        <Seperator />
        {checkOut && (<Text style={{ fontSize: 15 }}>Check Out: {moment(checkOut?.time).format('h:mm a')}</Text>)}
      </TouchableOpacity>
      <Text style={{ fontSize: 19, color: Colors.titles, fontWeight: 'bold', marginTop: 20 }}>Daily Report</Text>
      <FlatList
        data={dailyReportsList}
        renderItem={({item}) => {
            return(
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ReportDetails', {
                  ...item,
                  time: moment(new Date(item.time.seconds * 1000)).format('MMM Do[\n]h:ss a')
                } )}>
                <Text style={{ color: Colors.titles, fontSize: 20 }}>{moment(new Date(item.time.seconds * 1000)).format('MMMM Do')}   Report</Text>
                <Text style={{ color: Colors.texts, fontSize: 15 }}>{moment(new Date(item.time.seconds * 1000)).format('h:mm a')}</Text>
              </TouchableOpacity>
            )
        }}
      />
      <Text style={{ fontSize: 19, color: Colors.titles, fontWeight: 'bold', marginTop: 20 }}>Tasks Done</Text>
      <FlatList
        data={updatesList}
        renderItem={({item}) => {
            return(
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('UpdateDetails', {
                  ...item,
                  time: moment(new Date(item.time.seconds * 1000)).format('MMM Do[\n]h:ss a')
                } )}>
                <Text style={{ color: Colors.titles, fontSize: 20 }}>{item.title}</Text>
                <Text style={{ color: Colors.texts, fontSize: 15 }}>{moment(new Date(item.time.seconds * 1000)).format('h:mm a')}</Text>
              </TouchableOpacity>
            )
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
      // flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 15,
      borderRadius: 5
    },
    card:{
      backgroundColor: 'white',
      marginVertical: 5,
      borderRadius: 10,
      padding: 10
    }
  })

export default UpdatesListScreen;