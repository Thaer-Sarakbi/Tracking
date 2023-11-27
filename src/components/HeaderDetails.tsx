import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../assets/Colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../AppStack';

interface Props {
  navigation: StackNavigationProp<RootStackParamsList, "HeaderDetails">
}

const HeaderDetails = ({ navigation } : Props) => {

  return (
    <View style={{ backgroundColor: Colors.main, width: '100%', height: 50, justifyContent: 'center', paddingLeft: 10 }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-outline" size={30} color={'white'} />
      </TouchableOpacity>
    </View>
  );
}

export default HeaderDetails;