import React, { useState, useEffect } from 'react';
import TasksListScreen from '../screens/TasksListScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Header from '../components/Header';
import { Colors } from '../assets/Colors';
import { TouchableOpacity, Modal, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NewTaskModal from '../components/NewTaskModal';
import { useDispatch, useSelector } from 'react-redux';
import { Task } from '../types/types';
import { RootStackParamsList } from './AppStack';
import { StackScreenProps } from '@react-navigation/stack';
import CompletedTaskScreen from '../screens/CompletedTaskScreen';
import { AppDispatch } from '../redux/store';
import { getUsers } from '../redux/usersSlice';
import firestore from '@react-native-firebase/firestore'

const Tab = createMaterialTopTabNavigator();

interface MyState {
  tasks: {data: Array<Task>}
}

export default function TopTabs({ navigation }: StackScreenProps<RootStackParamsList, 'TopTabs'>) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  // const tasks = useSelector((state: MyState) => state.tasks?.data)
  const user = useSelector((state: TasksState) => state.auth.user)

  const [tasks, setTasks] = useState([])
  const [notifications, setNotifications] = useState([])

  const changeModalVisible = (bool: boolean) => {
    setIsModalVisible(bool)
  }

  const dispatch = useDispatch<AppDispatch>()

  const adminData = async() => {
    let tasksList: Array<Task> = []

    const usersCollection = await firestore().collection('users')

    const usersQuerySnapshot = await usersCollection.get()
    let usersDataWithTasks = []
  
    for(const userDoc of usersQuerySnapshot.docs){
      const userTasksCollection = userDoc.ref.collection('tasks')
  
      const tasksQuerySnapshot = await userTasksCollection.get()
  
      const tasksData = tasksQuerySnapshot.docs.map((taskDoc) => ({
        id: taskDoc.id,
        ...taskDoc.data()
      }))
  
      if(tasksData[0]){
        usersDataWithTasks.push(
          // id: userDoc.id,
          // userData: userDoc.data(),
          ...tasksData
        )
      }

      setTasks(usersDataWithTasks)
    }
  }

  useEffect(() => {
    firestore()
    .collection('users')
    .doc(user?.id)
    .collection('notifications')
    .orderBy('creationDateNotification', "desc")
    .onSnapshot(snapshot => {
      console.log(snapshot.docs)
      const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(newData);
    })

    if(user?.admin){
      adminData()
    } else {
      firestore()
      .collection('users')
      .doc(user?.id)
      .collection('tasks')
      .orderBy('creationDate', "desc")
      .onSnapshot(snapshot => {
    
        const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTasks(newData);
      })
  }
    dispatch(getUsers())
  },[user])

  return (
    <>
      <Header navigation={navigation} notifications={notifications}/>
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
          children={() => <TasksListScreen navigation={navigation} user={user} tasks={tasks} />} 
          options={{
            tabBarBadge:()=> { return (  
              <View style={{ position: 'relative', top: 14, left: -60 }}>
                <Text>({
                  tasks?.filter(task => {
                    if(task?.status !== 'Completed'){
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