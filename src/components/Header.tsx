import React from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../assets/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Header = () => {

  const icons = [
    { name: "search-outline", size: 30, color: 'white' },
    { name: "notifications-outline", size: 30, color: 'white' },
    { name: "chatbubbles-outline", size: 30, color: 'white'} 
  ]

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity>
          <Icon name="menu-outline" size={40} color={'white'} />
        </TouchableOpacity>
        <Text style={styles.title}>Tasks</Text>
      </View>
      <View style={styles.right}>
        {
          icons.map((icon, i) => (
            <TouchableOpacity key={i}>
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
    }
})

export default Header;