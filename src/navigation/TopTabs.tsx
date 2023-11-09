import React, { useState } from 'react';
import TasksListScreen from '../screens/TasksListScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Header from '../components/Header';
import { Colors } from '../assets/Colors';
import { TouchableOpacity, Modal, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NewTaskModal from '../components/NewTaskModal';

const Tab = createMaterialTopTabNavigator();

export default function TopTabs() {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const changeModalVisible = (bool: boolean) => {
    setIsModalVisible(bool)
  }

  return (
    <>
      <Header />
      <Tab.Navigator 
        screenOptions={{
          // tabBarActiveTintColor: Colors.main,
          tabBarLabelStyle: { fontSize: 12 },
          // tabBarStyle: { backgroundColor: 'powderblue' },
          tabBarIndicatorStyle: { backgroundColor: Colors.main }
        }}
      >
        <Tab.Screen 
          name="Open" 
          component={TasksListScreen} 
        />
        <Tab.Screen 
          name="Completed" 
          component={TasksListScreen} 
        />
      </Tab.Navigator>
      <TouchableOpacity onPress={() => changeModalVisible(true)} style={{ backgroundColor: Colors.main, position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
        <Icon name="add-outline" size={35} color={'white'} />
      </TouchableOpacity>
      <Modal 
           transparent= {true}
           animationType= 'slide'
           visible= {isModalVisible}
         >
           {/* <ShareModal 
             changeModalVisible= {changeModalVisible}
           /> */}
           <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
             <NewTaskModal 
               changeModalVisible= {changeModalVisible}
             />
           </View>
         </Modal>
    </>
  );
}