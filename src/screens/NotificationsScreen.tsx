import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { notificationsState } from '../types/types';
import { AppDispatch } from '../redux/store';
import { getNotifications, updateNotifications } from '../redux/notificationsSlice';
import HeaderDetails from '../components/HeaderDetails';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AppStack';

const NotificationsScreen = ({ navigation } :  StackScreenProps<RootStackParamsList, 'Notifications'>) => {
  const notifications = useSelector((state: notificationsState) => state.notifications.data)
  const status = useSelector((state: notificationsState) => state.notifications.status)
  const user = useSelector((state: notificationsState) => state.auth.user)
  
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getNotifications(user.id))
  },[])

  if(status === 'loading'){
    return <View/>
  } else if(status === 'succeeded'){
    return (
        <View>
            <HeaderDetails navigation={navigation}/>
            <View style={styles.container}>
                <FlatList
                    data={notifications}
                    renderItem={(item) => {
                      console.log(item.item)
                      return(
                        <TouchableOpacity style={[styles.card, item.item.read ? { backgroundColor: 'white'  } : { backgroundColor: '#BDBDBD' }]} onPress={() => { 
                          navigation.navigate('TaskDetails', {
                            taskId: item.item.taskId,
                            userId: user.id,
                            userName: user.name,
                            status: item.item.status,
                            creationDate: item.item.creationDate
                        })
                          dispatch(updateNotifications({notificationId: item.item.id, userId: user.id}))
                          dispatch(getNotifications(user.id))
                        }}>
                        <Text style={styles.title}>{item.item.task}</Text>
                        <Text style={styles.message}>{item.item.message}</Text>
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
      height: 70,
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