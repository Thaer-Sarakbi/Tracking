import React from 'react';
import {StyleSheet, Text, View, TextInput, Button, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Task } from '../types/types';

const Card = ({item}: {item: Task}) => {
    return(
      <TouchableOpacity style ={styles.container}>
        <Text style={styles.date}>{item.creationDate}</Text>
        <View style={styles.seperator}/>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.status}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginVertical: 5 }}>
          <Icon name="person-outline" size={20} color={'#BDBDBD'} />
          <Text style={{ fontSize: 15, marginLeft: 5 }}>{item.assignedTo}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginVertical: 5 }}>
          <Icon name="hourglass-outline" size={20} color={'#BDBDBD'} />
          <Text style={{ fontSize: 15, marginLeft: 5 }}>{item.duration} Days</Text>
        </View>
        <View style={{ flexDirection: 'row', marginVertical: 5 }}>
          <Icon name="location-outline" size={20} color={'#BDBDBD'} />
          <Text style={{ fontSize: 15, marginLeft: 5 }}>{item.location}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const styles = StyleSheet.create({
    container:{
      backgroundColor: 'white',
      marginTop: 15,
      marginHorizontal: 10,
      paddingHorizontal: 10,
      paddingVertical: 15,
      borderRadius: 5
    },
    date:{
      fontSize: 17,
      color: 'black'
    },
    seperator:{
      height: 1,
      width: '100%',
      backgroundColor: '#EEEEEE',
      marginVertical: 10
    },
    title:{
      fontWeight: 'bold',
      fontSize: 25,
      color: 'black'
    },
    status: {
      borderWidth: 2,
      borderColor: '#5C6BC0',
      paddingHorizontal: 5,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      width: '30%'
    },
    statusText:{
      color: '#5C6BC0',
      fontSize: 15
    }
  })
export default Card;