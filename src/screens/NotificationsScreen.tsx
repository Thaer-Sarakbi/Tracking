import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { notificationsState } from '../types/types';
import { AppDispatch } from '../redux/store';
import { updateNotifications } from '../redux/notificationsSlice';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AppStack';
import firestore from '@react-native-firebase/firestore'
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../assets/Colors';
import moment from 'moment';

const NotificationsScreen = ({ navigation } :  StackScreenProps<RootStackParamsList, 'Notifications'>) => {

  const user = useSelector((state: notificationsState) => state.auth.user)

  const [notifications, setNotifications] = useState<any>([])
  const [limit, setLimit] = useState(10)
  const [footerLoading, setFooterLoading] = useState(true)
  
  const dispatch = useDispatch<AppDispatch>()

  const getNotifications = () => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(user.id)
      .collection('notifications')
      .orderBy('creationDateNotification', "desc")
      .limit(limit)
      .onSnapshot(snapshot => {
        const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if(newData.length === notifications?.length){
          setFooterLoading(false)
        }
        setNotifications(newData);
        setLimit(limit + 10)
      })

      return () => unsubscribe();
  }

  const footer = () => {
    return(
      footerLoading ? 
        <View style={styles.loader}>
          <ActivityIndicator size='large' />
        </View> : null
    )
}

  const handleLoadMore = () => {
    getNotifications()
  }

  useEffect(() => {
    getNotifications()
  },[])

  if(!notifications){
    return(
      <>
        <LottieView source={require("../assets/loading.json")} style={{flex: 1}} autoPlay loop />
      </>
    )
  } else {
    if(notifications.length === 0){
      return(
        <View style={styles.loadingContainer}>
          <Text style={{ fontSize: 15 }}>No Notifications yet</Text>
        </View>
      )
    } else {
        return (
            <View style={{ paddingBottom: 110 }}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-outline" size={30} color={'white'} />
                  </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <FlatList
                        data={notifications}
                        renderItem={({item}: any) => {
                          return(
                            <TouchableOpacity style={[styles.card, item.read ? { backgroundColor: 'white'  } : { backgroundColor: '#BDBDBD' }]} onPress={() => { 
                              navigation.navigate(item.screen, {
                                ...item,
                                time: moment(new Date(item.time?.seconds * 1000)).format('MMM Do[\n]h:ss a')
                              })
                              dispatch(updateNotifications({notificationId: item.id, userId: user.id, read: item.read}))
                            }}>
                            <Text style={styles.title}>{item.task}</Text>
                            <Text style={styles.message}>{item.message}</Text>
                            </TouchableOpacity>
                        )}}
                        onEndReached={handleLoadMore}
                        ListFooterComponent={footer}
                    />
                </View>
            </View>
        )}
  }
}

const styles = StyleSheet.create({
    container:{
      paddingHorizontal: 10,
      paddingTop: 10
    },
    loadingContainer: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    header: { 
      backgroundColor: Colors.main, 
      width: '100%', 
      height: 50, 
      justifyContent: 'center', 
      paddingLeft: 10 
    },
    card:{
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
    },
    loader:{
      marginTop: 10,
      alignItems: 'center'
    }
  })
export default NotificationsScreen;