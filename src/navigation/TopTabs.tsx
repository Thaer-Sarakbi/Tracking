import React, { useState, useEffect } from 'react';
import TasksListScreen from '../screens/TasksListScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Header from '../components/Header';
import { Colors } from '../assets/Colors';
import { TouchableOpacity, Modal, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NewTaskModal from '../components/NewTaskModal';
import { useDispatch, useSelector } from 'react-redux';
import { Task, User, tasks } from '../types/types';
import { RootStackParamsList } from './AppStack';
import { StackScreenProps } from '@react-navigation/stack';
import CompletedTaskScreen from '../screens/CompletedTaskScreen';
import { AppDispatch } from '../redux/store';
import { getUsers } from '../redux/usersSlice';
import firestore from '@react-native-firebase/firestore'
import { getTasks } from '../redux/tasksSlice';
import { useIsFocused } from '@react-navigation/native';
import InProgressTasksScreen from '../screens/InProgressTasksScreen';

const Tab = createMaterialTopTabNavigator();

interface MyState {
  tasks: tasks,
  auth: {
    user: User
  }
}

export default function TopTabs({ navigation }: StackScreenProps<RootStackParamsList, 'TopTabs'>) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const tasks = useSelector((state: MyState) => state.tasks?.data)
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

    // dispatch(getTasks({id: user?.id, admin: user?.admin}))
    dispatch(getUsers())

  },[user])

  return (
    <>
      <Header navigation={navigation} notifications={notifications} tasks={tasks} user={user}/>
      <Tab.Navigator 
      initialRouteName= "Not Started" 
        screenOptions={{
          // tabBarActiveTintColor: Colors.main,
          tabBarLabelStyle: { fontSize: 12 },
          // tabBarStyle: { backgroundColor: 'powderblue' },
          tabBarIndicatorStyle: { backgroundColor: Colors.main },
         
        }}
      >
        <Tab.Screen 
          name="Not Started" 
          children={() => <TasksListScreen navigation={navigation} user={user} tasks={tasks} />} 
          // options={{
          //   tabBarBadge:()=> { return (  
          //     <View style={{ position: 'relative', top: 14, left: -45 }}>
          //       <Text style={{ marginLeft: 20 }}>({
          //         tasks?.filter(task => {
          //           if(task?.status !== 'Completed'){
          //             return task
          //           }
          //         }).length
          //       })</Text>
          //     </View> ) }
          // }}
        />
        <Tab.Screen 
          name="In Progress" 
          // component={InProgressTasksScreen} 
          children={() => <InProgressTasksScreen navigation={navigation} user={user} tasks={tasks} />} 
        />
        <Tab.Screen 
          name="Completed" 
          component={CompletedTaskScreen} 
        />
      </Tab.Navigator>
      {user?.admin && (<TouchableOpacity onPress={() => changeModalVisible(true)} style={{ backgroundColor: Colors.main, position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
        <Icon name="add-outline" size={35} color={'white'} />
      </TouchableOpacity>)}
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