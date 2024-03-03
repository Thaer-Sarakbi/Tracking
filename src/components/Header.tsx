import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../assets/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Notification, Task, User } from '../types/types';

interface Props {
  notifications: Array<Notification>,
  navigation: {navigate: (screen: string, data: {
    tasks: Task[] | undefined,
    user: User | undefined
  }) => void},
  tasks: Task[],
  user: User
}

const Header = ({ navigation, notifications, tasks, user } : Props) => {
 
  const icons = [
    { name: "search-outline", size: 35, color: 'white' },
    { name: "notifications-outline", size: 35, color: 'white' },
    { name: "chatbubbles-outline", size: 35, color: 'white'} 
  ]

  const handleNav = (name: string) => {
    if(name === 'notifications-outline'){
      navigation.navigate('Notifications', {tasks: undefined, user: undefined})
    } else if(name === 'search-outline'){
      navigation.navigate('Search', { tasks, user })
    } else if(name === 'chatbubbles-outline'){
      navigation.navigate('ChatList', {tasks: undefined, user: undefined})
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {/* <TouchableOpacity>
          <Icon name="menu-outline" size={40} color={'white'} />
        </TouchableOpacity> */}
        <Text style={styles.title}>Tasks</Text>
      </View>
      <View style={styles.right}>
        {
          icons.map((icon, i) => (
            <TouchableOpacity key={i} onPress={() => handleNav(icon.name)}>
              {icon.name === 'notifications-outline' && (
                <View style={styles.notificationIconBadge}>
                  <Text style={{ color: 'white', margin: 2 }}>{notifications.filter(notification => {
                    if(notification.read === false){
                      return notification
                    }
                  }).length}</Text>
                </View>
              )}
              <Icon name= {icon.name} size={icon.size} color={icon.color} />
            </TouchableOpacity>
          ))
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: Colors.main,
      paddingHorizontal: 10,
      height: 80,
      alignItems: 'flex-end',
      paddingBottom: 10
    },
    right:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1
    },
    left:{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 2
    },
    title:{
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        marginHorizontal: 15
    },
    notificationIconBadge: { 
      backgroundColor: 'red', 
      position: 'absolute', 
      top: -5, 
      left: 15, 
      zIndex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      borderRadius: 10 
    }
})

export default Header;