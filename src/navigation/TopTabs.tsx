import React, { useState, useEffect } from 'react';
import TasksListScreen from '../screens/NotStartedScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Header from '../components/Header';
import { Colors } from '../assets/Colors';
import { TouchableOpacity, Modal, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NewTaskModal from '../components/NewTaskModal';
import { useDispatch, useSelector } from 'react-redux';
import { User, tasks } from '../types/types';
import { RootStackParamsList } from './AppStack';
import { StackScreenProps } from '@react-navigation/stack';
import CompletedTaskScreen from '../screens/CompletedTaskScreen';
import { AppDispatch } from '../redux/store';
import { getUsers } from '../redux/usersSlice';
import firestore from '@react-native-firebase/firestore'
import InProgressTasksScreen from '../screens/InProgressTasksScreen';

const Tab = createMaterialTopTabNavigator();

interface MyState {
  tasks: tasks,
  users: {
    data: User[]
  },
  auth: {
    user: User
  }
}

export default function TopTabs({ navigation }: StackScreenProps<RootStackParamsList, 'TopTabs'>) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const tasks = useSelector((state: MyState) => state.tasks?.data)
  const status = useSelector((state: MyState) => state.tasks?.status)
  const users = useSelector((state: MyState) => state.users.data)
  const user = useSelector((state: MyState) => state.auth.user)

  const [notifications, setNotifications] = useState([])

  const changeModalVisible = (bool: boolean) => {
    setIsModalVisible(bool)
  }

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    firestore()
    .collection('users')
    .doc(user?.id)
    .collection('notifications')
    .orderBy('creationDateNotification', "desc")
    .onSnapshot(snapshot => {
      const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(newData);
    })

    dispatch(getUsers())

  },[user])

  return (
    <>
      <Header navigation={navigation} notifications={notifications} tasks={tasks} user={user} />
      <Tab.Navigator 
      initialRouteName= "Not Started" 
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12 },
          tabBarIndicatorStyle: { backgroundColor: Colors.main },
         
        }}
      >
        <Tab.Screen 
          name="Not Started" 
          children={() => <TasksListScreen navigation={navigation} users={users} tasks={tasks} status={status} />} 
        />
        <Tab.Screen 
          name="In Progress" 
          children={() => <InProgressTasksScreen navigation={navigation} tasks={tasks} status={status} users={users} />} 
        />
        <Tab.Screen 
          name="Completed" 
          children={() => <CompletedTaskScreen navigation={navigation} tasks={tasks} status={status} users={users} />} 
        />
      </Tab.Navigator>
      {user?.admin && (<TouchableOpacity onPress={() => changeModalVisible(true)} style={styles.addButton}>
        <Icon name="add-outline" size={35} color={'white'} />
      </TouchableOpacity>)}
      <Modal 
           transparent= {true}
           animationType= 'slide'
           visible= {isModalVisible}
         >
           <View style={styles.newTaskModal}>
             <NewTaskModal 
               changeModalVisible= {changeModalVisible}
             />
           </View>
         </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addButton: { 
    backgroundColor: Colors.main, 
    position: 'absolute', 
    bottom: 20, 
    right: 20, 
    width: 60, 
    height: 60, 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  newTaskModal: { 
    flex: 1, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
})
