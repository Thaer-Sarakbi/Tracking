import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { getTasks } from '../redux/tasksSlice';
import { TasksState } from '../types/types';
import Card from '../components/Card';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AppStack';
import PushNotification from 'react-native-push-notification';
import AnimatedLottieView from 'lottie-react-native';
 
const TasksListScreen = ({ navigation } : StackScreenProps<RootStackParamsList, 'TasksList'>) => {
  const tasks = useSelector((state: TasksState) => state.tasks.data)
  const status = useSelector((state: TasksState) => state.tasks.status)
  const user = useSelector((state: TasksState) => state.auth.user)

  const [isFetching, setIsFetching] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const onRefresh = () => {
    setIsFetching(true)
    dispatch(getTasks(user.id))
    setIsFetching(false)
  }

  useEffect(() => {
    dispatch(getTasks(user.id))

    createChannels()
  },[])

  const createChannels = () => {
    PushNotification.createChannel(
      {
          channelId: "update-status", // (required)
          channelName: "update status", // (required)
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
  }

  if(status === 'loading'){
    return (
      <View style={{ flex: 1 , justifyContent: 'center', alignItems: 'center'}}>
        <AnimatedLottieView source={require('../assets/loading.json')} autoPlay loop />
      </View>
    )
  } else if(status === 'succeeded'){
    return (
      <View style={{ flex: 1 }}>
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={tasks}
            renderItem={(item) => {
              if(item.item.status !== 'Completed'){
                return(
                  <TouchableOpacity onPress={() => { navigation.navigate('TaskDetails', {
                    taskId: item.item.id,
                    userId: user.id,
                    userName: user.name,
                    status: item.item.status,
                    creationDate: item.item.creationDate
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
    );
  }
}

export default TasksListScreen;