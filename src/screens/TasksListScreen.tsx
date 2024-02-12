import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { getTasks } from '../redux/tasksSlice';
import { TasksState, User } from '../types/types';
import Card from '../components/Card';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AppStack';
import PushNotification from 'react-native-push-notification';
import LottieView from "lottie-react-native";
import firestore from '@react-native-firebase/firestore'
import { useIsFocused } from '@react-navigation/native';
 
const TasksListScreen = ({ navigation, user, tasks } : StackScreenProps<RootStackParamsList, 'TasksList'>) => {

  const status = useSelector((state: TasksState) => state.tasks.status)
  const users = useSelector((state: MyState) => state.users.data)

  const [isFetching, setIsFetching] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const isFocused = useIsFocused();

  const onRefresh = () => {
    setIsFetching(true)
    dispatch(getTasks({id: user.id, admin: user.admin}))
    setIsFetching(false)
  }

  useEffect(() => {
    dispatch(getTasks({id: user?.id, admin: user?.admin}))

    const interval = setInterval(() => {
  
      dispatch(getTasks({id: user?.id, admin: user?.admin}))
    }, 60000);

    return () => clearInterval(interval)
    
    
    // console.log(user)
  //   if(user?.admin){
  //     adminData()
  //   } else {
  //     firestore()
  //     .collection('users')
  //     .doc(user?.id)
  //     .collection('tasks')
  //     .orderBy('creationDate', "desc")
  //     .onSnapshot(snapshot => {
    
  //       const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //       setTasks(newData);
  //     })
  // }
   

  //   if(user.admin){
  //     const usersCollection = await firestore().collection('users')
  
  //     const usersQuerySnapshot = await usersCollection.get()
  //     let usersDataWithTasks = []
    
  //     for(const userDoc of usersQuerySnapshot.docs){
  //       const userTasksCollection = userDoc.ref.collection('tasks')
    
  //       const tasksQuerySnapshot = await userTasksCollection.get()
    
  //       const tasksData = tasksQuerySnapshot.docs.map((taskDoc) => ({
  //         id: taskDoc.id,
  //         ...taskDoc.data()
  //       }))
    
  //       if(tasksData[0]){
  //         usersDataWithTasks.push(
  //           // id: userDoc.id,
  //           // userData: userDoc.data(),
  //           ...tasksData
  //         )
  //       }
  //       setTasks(usersDataWithTasks)
  //     }
  //   } else {
  //   const unsubscribe = firestore()
  //   .collection('users')
  //   .doc(user.id)
  //   .collection('tasks')
  //   .orderBy('creationDate', "desc")
  //   .onSnapshot(snapshot => {
  //     const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //     setTasks(newData);
  //   })

  // // Unsubscribe when component unmounts
  // return () => unsubscribe();

  // }


    // createChannels()
  },[user])

  if(status === 'loading'){
    return (
      <>
        <LottieView source={require("../assets/loading.json")} style={{flex: 1}} autoPlay loop />
      </>
    )
  } else if(status === 'succeeded'){
    if(tasks.length === 0){
      return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 15 }}>No Tasks yet</Text>
        </View>
      )
    } else {
        return (
          <View style={{ flex: 1 }}>
              <FlatList
                keyExtractor={(item) => item?.id.toString()}
                data={tasks}
                renderItem={(item) => {
                  if(item.item?.status == 'Not Started'){
                    const assigned = users.find((user: User) => {
          
                      if(user.value === item.item.assignedTo){
                        return user
                      }
                    })
                    
                    return(
                      <TouchableOpacity onPress={() => { navigation.navigate('TaskDetails', {
                        taskId: item.item.id,
                        assignedTo: item.item.assignedTo,
                        status: item.item.status,
                        creationDate: item.item.creationDate,
                        title: item.item.title,
                        latitude: item.item.latitude,
                        longitude: item.item.longitude,
                        description: item.item.description,
                        duration: item.item.duration,
                        assigenId: item.item.assigenId,
                        assignedBy: item.item.assignedBy,
                        deviceToken: assigned.deviceToken
                      })}} >
                        <Card item={item.item} />
                      </TouchableOpacity>
                    )
                  } else {
                    return null
                  }
                }}
                onRefresh= {() => onRefresh()}
                refreshing={isFetching}
              />
          </View>
        );}
  }
}

export default TasksListScreen;