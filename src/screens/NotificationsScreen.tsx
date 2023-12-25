import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { notificationsState } from '../types/types';
import { AppDispatch } from '../redux/store';
import { getNotifications, updateNotifications } from '../redux/notificationsSlice';
import HeaderDetails from '../components/HeaderDetails';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AppStack';
import firestore from '@react-native-firebase/firestore'
import LottieView from 'lottie-react-native';

const NotificationsScreen = ({ navigation } :  StackScreenProps<RootStackParamsList, 'Notifications'>) => {
  // const notifications = useSelector((state: notificationsState) => state.notifications.data)
  const status = useSelector((state: notificationsState) => state.notifications.status)
  const user = useSelector((state: notificationsState) => state.auth.user)

  const [notifications, setNotifications] = useState([])
  // console.log(notifications)
  
  const dispatch = useDispatch<AppDispatch>()

  // useEffect(() => {
  //   dispatch(getNotifications(user.id))
  // },[])

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(user.id)
      .collection('notifications')
      .orderBy('creationDateNotification', "desc")
      .onSnapshot(snapshot => {
        // res.docs.forEach(snapshot => {
        //   // snapshot.data().id = snapshot.id
        //   console.log(snapshot.data())
        //   // notificationsList.push(snapshot.data() as any) 
  
        // })
    
        const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNotifications(newData);
      })

    // Unsubscribe when component unmounts
    return () => unsubscribe();
  },[])

  if(notifications.length === 0){
    return(
      <>
        <LottieView source={require("../assets/loading.json")} style={{flex: 1}} autoPlay loop />
      </>
    )
  } else {
    return (
        <View>
            <HeaderDetails navigation={navigation}/>
            <View style={styles.container}>
                <FlatList
                    data={notifications}
                    renderItem={({item}) => {
                      console.log(item)
                      return(
                        <TouchableOpacity style={[styles.card, item.read ? { backgroundColor: 'white'  } : { backgroundColor: '#BDBDBD' }]} onPress={() => { 
                        //   navigation.navigate('TaskDetails', {
                        //     taskId: item.item.taskId,
                        //     userId: user.id,
                        //     userName: item.item.assignTo,
                        //     status: item.item.status,
                        //     creationDate: item.item.creationDate,
                        //     duration: item.item.duration,
                        //     title: item.item.title,
                        //     description: item.item.description
                        // })
                          navigation.navigate(item.screen, item )
                          dispatch(updateNotifications({notificationId: item.id, userId: user.id, read: item.read}))
                          dispatch(getNotifications(user.id))
                        }}>
                        <Text style={styles.title}>{item.task}</Text>
                        <Text style={styles.message}>{item.message}</Text>
                        </TouchableOpacity>
                    )}}
                />
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
      paddingHorizontal: 10,
      paddingTop: 10
    },
    card:{
      // backgroundColor: 'white',
      // height: 70,
      borderRadius: 5,
      padding: 10,
      marginVertical: 5
    },
    title:{
      color: 'black',
      fontSize: 20
    },
    message:{
      fontSize: 20
    }
  })
export default NotificationsScreen;