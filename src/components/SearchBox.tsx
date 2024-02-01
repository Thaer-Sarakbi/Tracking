import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../assets/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBox = ({ navigation, onChangeText }) => {

    return (
      <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={35} color={'white'} />
        </TouchableOpacity>
      </View>
      <View style={styles.right}>
        <TextInput
          // value={search}
          onChangeText={(text) => onChangeText(text)}
          autoFocus={true}
          style={{ flex: 1, backgroundColor: 'white', borderRadius: 10, marginVertical: 5, marginRight: 5, fontSize: 15 }}
        />
      </View>

    </View>
    )
}

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.main,
    paddingHorizontal: 10,
    // height: 80,
    alignItems: 'center',
    // paddingBottom: 10
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
      // flex: 2
  },
  title:{
      color: 'white',
      fontSize: 25,
      fontWeight: 'bold',
      marginHorizontal: 15
  }
})

export default SearchBox