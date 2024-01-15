import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Notification, notificationsState } from '../types/types';
import { AppDispatch } from '../redux/store';
import { getNotifications, updateNotifications } from '../redux/notificationsSlice';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AppStack';
import firestore from '@react-native-firebase/firestore'
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../assets/Colors';

const NotificationsScreen = ({ navigation } :  StackScreenProps<RootStackParamsList, 'Notifications'>) => {

  const status = useSelector((state: notificationsState) => state.notifications.status)
  const user = useSelector((state: notificationsState) => state.auth.user)

  const [notifications, setNotifications] = useState([])
  
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(user.id)
      .collection('notifications')
      .orderBy('creationDateNotification', "desc")
      .onSnapshot(snapshot => {
    
        const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNotifications(newData);
      })

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
            <View style={{ backgroundColor: Colors.main, width: '100%', height: 50, justifyContent: 'center', paddingLeft: 10 }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back-outline" size={30} color={'white'} />
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <FlatList
                    data={notifications}
                    renderItem={({item}: Notification) => {
                      return(
                        <TouchableOpacity style={[styles.card, item.read ? { backgroundColor: 'white'  } : { backgroundColor: '#BDBDBD' }]} onPress={() => { 
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