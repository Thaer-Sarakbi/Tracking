import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../assets/Colors';
import { RootStackParamsList } from '../navigation/AppStack';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import 'moment/locale/en-gb'
import firestore from '@react-native-firebase/firestore'
import Seperator from '../components/Seperator';

interface Props {
  route: RouteProp<RootStackParamsList, "UpdatesList">
  navigation: StackNavigationProp<RootStackParamsList, "UpdatesList">
}

const UpdatesListScreen = ({ route, navigation }: Props) => {
  const updatesList = route.params.updatesList
  const dailyReport = route.params.dailyReport
  const leaveReport = route.params.leaveReport
  const date = route.params.date
  const selected = route.params.selected

  const [checkIn, setCheckIn] = useState<{time: Date}>()
  const [checkOut, setCheckOut] = useState<{time: Date}>()

  const retreiveCheckIn = async () => {
    await firestore().collection('users').doc(selected).collection('checkIn').get()
    .then((res) => {
       res.docs.forEach(doc => {
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
    await firestore().collection('users').doc(selected).collection('checkOut').get()
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
      {(checkIn || checkOut) && (<TouchableOpacity onPress={() => navigation.navigate('AttendanceDetails', {
        checkIn,
        checkOut
      })} style={styles.card}>
        {checkIn && (<Text style={{ fontSize: 15 }}>Check In: {moment(checkIn?.time).format('h:mm a')}</Text>)}
        <Seperator />
        {checkOut && (<Text style={{ fontSize: 15 }}>Check Out: {moment(checkOut?.time).format('h:mm a')}</Text>)}
      </TouchableOpacity>)}
      {dailyReport && (<><Text style={{ fontSize: 19, color: Colors.titles, fontWeight: 'bold', marginTop: 20 }}>Daily Report</Text>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ReportDetails', {
                  ...dailyReport,
                  time: moment(new Date(dailyReport.time.seconds * 1000)).format('MMM Do[\n]h:ss a')
                } )}>
                <Text style={{ color: Colors.titles, fontSize: 20 }}>{moment(new Date(dailyReport?.time.seconds * 1000)).format('MMMM Do')}   Report</Text>
                <Text style={{ color: Colors.texts, fontSize: 15 }}>{moment(new Date(dailyReport?.time.seconds * 1000)).format('h:mm a')}</Text>
              </TouchableOpacity></>)}
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
            {leaveReport && (<><Text style={{ fontSize: 19, color: Colors.titles, fontWeight: 'bold', marginTop: 20 }}>Leave Report</Text>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('LeaveDetails', {
                  ...leaveReport,
                  time: moment(new Date(leaveReport.time.seconds * 1000)).format('MMM Do[\n]h:ss a')
                } )}>
                <Text style={{ color: Colors.titles, fontSize: 20 }}>{moment(new Date(leaveReport?.time.seconds * 1000)).format('MMMM Do')}   Report</Text>
                <Text style={{ color: Colors.texts, fontSize: 15 }}>{moment(new Date(leaveReport?.time.seconds * 1000)).format('h:mm a')}</Text>
              </TouchableOpacity></>)}
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