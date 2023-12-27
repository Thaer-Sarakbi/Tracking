import React from 'react';
import {StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Task } from '../types/types';
import moment from 'moment';

const Card = ({item}: { item: Task }  ) => {

  const getStyle = (status: string) => {
    if(status === 'In Progress'){
      return{
        borderColor: '#64DD17',
        color: '#64DD17',
      }
    } else if(status === 'Not Started'){
      return{
        borderColor: '#5C6BC0',
        color: '#5C6BC0',
      } 
    } else if(status === 'Completed'){
      return{
        borderColor: 'red',
        color: 'red',
      }
    }
  }

    return(
      <View style ={styles.container}>
        <Text style={styles.date}>{moment(new Date(item.creationDate?._seconds * 1000)).format('MMMM Do YYYY, h:ss a')}</Text>
        <View style={styles.seperator}/>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={[styles.status, getStyle(item.status)]}>
            <Text style={[styles.statusText, getStyle(item?.status)]}>{item.status}</Text>
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
      </View>
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
      // borderColor: '#5C6BC0',
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