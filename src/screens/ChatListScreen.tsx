import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../assets/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AppStack';

interface Props {
  navigation: StackNavigationProp<RootStackParamsList, "ChatList">
}

const ChatListScreen = ({ navigation }: Props) => {
 
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