import React, { useState, useEffect } from 'react';
import TasksListScreen from '../screens/TasksListScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Header from '../components/Header';
import { Colors } from '../assets/Colors';
import { TouchableOpacity, Modal, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NewTaskModal from '../components/NewTaskModal';
import { useSelector } from 'react-redux';
import { Task, notificationsState } from '../types/types';
import { RootStackParamsList } from '../AppStack';
import { StackScreenProps } from '@react-navigation/stack';
import CompletedTaskScreen from '../screens/CompletedTaskScreen';

const Tab = createMaterialTopTabNavigator();

interface MyState {
  tasks: {data: Array<Task>}
}

export default function TopTabs({ navigation }: StackScreenProps<RootStackParamsList, 'TopTabs'>) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const tasks = useSelector((state: MyState) => state.tasks.data)

  const changeModalVisible = (bool: boolean) => {
    setIsModalVisible(bool)
  }

  return (
    <>
      <Header navigation={navigation}/>
      <Tab.Navigator 
        screenOptions={{
          // tabBarActiveTintColor: Colors.main,
          tabBarLabelStyle: { fontSize: 12 },
          // tabBarStyle: { backgroundColor: 'powderblue' },
          tabBarIndicatorStyle: { backgroundColor: Colors.main },
         
        }}
      >
        <Tab.Screen 
          name="Open" 
          component={TasksListScreen} 
          options={{
            tabBarBadge:()=> { return (  
              <View style={{ position: 'relative', top: 14, left: -60 }}>
                {/* <Text>({tasks.length})</Text> */}
                <Text>({
                  tasks.filter(task => {
                    if(task.status !== 'Completed'){
                      return task
                    }
                  }).length
                })</Text>
              </View> ) }
          }}
        />
        <Tab.Screen 
          name="Completed" 
          component={CompletedTaskScreen} 
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