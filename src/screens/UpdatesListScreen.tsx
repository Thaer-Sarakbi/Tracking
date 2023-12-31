import moment from 'moment';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../assets/Colors';

const UpdatesListScreen = ({ route, navigation }) => {
  const updatesList = route.params.updatesList
  const date = route.params.date

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>{moment(date).format('L')}</Text>
      <FlatList
        data={updatesList}
        renderItem={({item}) => {
            return(
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('UpdateDetails', item )}>
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
      height: 60,
      padding: 10
    }
  })

export default UpdatesListScreen;