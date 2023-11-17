import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { getTasks } from '../redux/tasksSlice';
import { Task, tasks, TasksState } from '../types/types';
import Card from '../components/Card';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsList } from '../AppStack';
import PushNotification from 'react-native-push-notification';

const TasksListScreen = ({ navigation } : StackScreenProps<RootStackParamsList, 'TasksList'>) => {
  const tasks = useSelector((state: TasksState) => state.tasks.data)
  const status = useSelector((state: TasksState) => state.tasks.status)

  const [isFetching, setIsFetching] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const onRefresh = () => {
    setIsFetching(true)
    dispatch(getTasks())
    setIsFetching(false)
  }

  useEffect(() => {
    dispatch(getTasks())

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
    return <View/>
  } else if(status === 'succeeded'){
    return (
      <View style={{ flex: 1 }}>
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={tasks}
            renderItem={(item) => (
              <TouchableOpacity onPress={() => { navigation.navigate('TaskDetails', {
                taskId: item.item.id
              })}} >
                <Card item={item.item} />
              </TouchableOpacity>
            )}
            onRefresh= {() => onRefresh()}
            refreshing={isFetching}
          />
      </View>
    );
  }
}

export default TasksListScreen;