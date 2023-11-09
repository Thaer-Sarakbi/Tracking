import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { getTasks } from '../redux/tasksSlice';
import { Task } from '../types/types';
import Card from '../components/Card';

interface MyState {
  tasks: {data: Array<Task>}
}

const TasksListScreen = () => {

  const tasks = useSelector((state: MyState) => state.tasks.data)

  const [isFetching, setIsFetching] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const onRefresh = () => {
    setIsFetching(true)
    dispatch(getTasks())
    setIsFetching(false)
  }

  useEffect(() => {
    dispatch(getTasks())
  },[])

  return (
    <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={tasks}
          renderItem={Card}
          onRefresh= {() => onRefresh()}
          refreshing={isFetching}
        />
    </View>
  );
}

export default TasksListScreen;