import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { useDispatch, useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore'
import moment from 'moment';
import { getUsers } from '../redux/usersSlice';
import { SelectList } from 'react-native-dropdown-select-list'
import { Colors } from '../assets/Colors';
import { AppDispatch } from '../redux/store';

const CalendarScreen = ({ navigation }) => {
  const users = useSelector((state: MyState) => state.users.data)
  const user = useSelector((state: TasksState) => state.auth.user)


  const dispatch = useDispatch<AppDispatch>()

  const [date,setDate] = React.useState(new Date());
  const [updates, setUpdates] = useState([])
  const [selected, setSelected] = React.useState();
  const [data,setData] = React.useState([]);

  const retreiveUpdates = async() =>{

    const usersCollection = await firestore().collection('users').doc(selected).collection('tasks')

    const usersQuerySnapshot = await usersCollection.get()
    let usersDataWithUpdates = []
  
    for(const userDoc of usersQuerySnapshot.docs){
      const userUpdatesCollection = userDoc.ref.collection('updates')
  
      const updatesQuerySnapshot = await userUpdatesCollection.get()
  
      const updatesData = updatesQuerySnapshot.docs.map((updateDoc) => ({
        updateId: updateDoc.id,
        ...updateDoc.data()
      }))
  
      if(updatesData[0]){
        usersDataWithUpdates.push(
          ...updatesData
        )
      }
    }
    setUpdates(usersDataWithUpdates)
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      retreiveUpdates()
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, selected]);

  useEffect(() => {
    retreiveUpdates()
    dispatch(getUsers())
    
    if(users){
        // let newArray = users.map((item) => {
        //   if(user.admin){
        //     return {key: item.id, value: item.value}
        //   } else {
        //     if(item.value === user.name){
        //       return {key: item.id, value: item.value}
        //     }
        //   }
            

          
        //   })

        let newArray = []
          if(user.admin){
            users.forEach((item) => {
              newArray.push({key: item.id, value: item.value})
            })
          } else {
            users.forEach(item => {
              if(item.value === user.name){
                // console.log(item.id, item.value)
                newArray.push({key: item.id, value: item.value})  
              }
            })
          }
         
          setData(newArray)
      }
  },[selected])
  
  let workDays = []

  updates.forEach(update => {
    // console.log(new Date(update.time.seconds * 1000).getMonth() + 1, new Date(date).getMonth() + 1)
    if(new Date(update.time.seconds * 1000).getMonth() + 1 === new Date(date).getMonth() + 1){
      // return moment(new Date(update.time.seconds * 1000)).format('L')
      workDays.push(moment(new Date(update.time.seconds * 1000)).format('L'))
    }
    // workDays.push(moment(new Date(update.time.seconds * 1000)).format('L'))
  })
  

  // console.log(workDays)
  const filteredWorksDays = [... new Set(workDays)]

  let today = moment(date);
  let day = today.clone().startOf('month');   //first day of month
  let customDatesStyles = [];
  while(day.add(1, 'day').isSame(today, 'month')) {
    if(filteredWorksDays.includes(moment(day.clone()).format('L'))){
        customDatesStyles.push({
            date: day.clone(),
            style: {backgroundColor: 'green'},
            textStyle: {color: 'white'}, // sets the font color
            containerStyle: [], // extra styling for day container
            allowDisabled: true, // allow custom style to apply to disabled dates
          });  
    } else {
        customDatesStyles.push({
            date: day.clone(),
            style: {backgroundColor: 'red'},
            textStyle: {color: 'white'}, // sets the font color
            containerStyle: [], // extra styling for day container
            allowDisabled: true, // allow custom style to apply to disabled dates
          });
    }

  }

  // console.log(customDatesStyles)

  const filterUpdatesByDates = (date) => {
    const updatesList = updates.filter(update => {
        if(moment(new Date(update.time.seconds * 1000)).format('L') === moment(date).format('L')){
          return update
        }
      })

      navigation.navigate('UpdatesList', {updatesList, date})
  }

  return (
    <View style={styles.container}>
        <Text style={{ color: Colors.titles, fontWeight: 'bold', fontSize: 30, alignSelf: 'center' }}>Calendar</Text>
        <SelectList 
          setSelected={(val) => setSelected(val)} 
          data={data} 
        //   save="value"
        //   value={value}
          boxStyles={{ marginHorizontal: 10, marginVertical: 10, height: 50, alignItems: 'center' }}
        />
          
        <CalendarPicker
          onDateChange={(date) => filterUpdatesByDates(date)}
          customDatesStyles={customDatesStyles}
          onMonthChange={(date) => setDate(date)}
        />

        <View style={{ flex:  1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ alignSelf: 'center', fontSize: 20 }}>{filteredWorksDays.length} Days Working</Text>
        </View>
  </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        // marginTop: 100,
    },
  });
  
export default CalendarScreen;