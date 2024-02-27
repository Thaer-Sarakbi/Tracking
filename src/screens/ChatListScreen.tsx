import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../assets/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Notification, notificationsState } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AppStack';

const ChatListScreen = ({ navigation }) => {
 
  return (
    <View>
      <View style={{ backgroundColor: Colors.main, width: '100%', height: 50, justifyContent: 'center', paddingLeft: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={30} color={'white'} />
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>No chat yet</Text>
      </View>
    </View>
  );
}

export default ChatListScreen;