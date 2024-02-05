import moment from 'moment';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../assets/Colors';
import { RootStackParamsList } from '../navigation/AppStack';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import 'moment/locale/en-gb'

interface Props {
  route: RouteProp<RootStackParamsList, "UpdatesList">
  navigation: StackNavigationProp<RootStackParamsList, "UpdatesList">
}

const UpdatesListScreen = ({ route, navigation }: Props) => {
  const updatesList = route.params.updatesList
  const date = route.params.date

  moment.locale('en-gb');        
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>{moment(date).format('L')}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
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