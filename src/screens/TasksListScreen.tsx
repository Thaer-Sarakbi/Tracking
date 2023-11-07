import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { getTasks } from '../redux/tasksSlice';
import { Task } from '../types/types';

interface MyState {
  tasks: {data: Array<Task>}
}

const TasksListScreen = () => {

  const tasks = useSelector((state: MyState) => state.tasks.data)
  console.log(tasks)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getTasks())
  },[])

  return (
    <View style={{ flex: 1 }}>
      <Text>Tasks List Screen</Text>
    </View>
  );
}

export default TasksListScreen;