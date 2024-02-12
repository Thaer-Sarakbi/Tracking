import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getTasks } from '../redux/tasksSlice';
import { useDispatch, useSelector } from 'react-redux';

function TasksLists (originalComponent){
    // console.log(originalComponent)
  const  NewComponent = () =>{
    const tasks = useSelector((state: MyState) => state.tasks.data)
    const status = useSelector((state: MyState) => state.tasks.status)
    const user = useSelector((state: MyState) => state.auth.user)
  
    const [isFetching, setIsFetching] = useState(false)
  
    const dispatch = useDispatch<AppDispatch>()

    const onRefresh = () => {
        setIsFetching(true)
        dispatch(getTasks({id: user?.id, admin: user?.admin}))
        setIsFetching(false)
    }

    useEffect(() => {
        dispatch(getTasks({id: user?.id, admin: user?.admin}))
    },[])

    return (
      <originalComponent tasks={tasks} status={status} onRefresh={onRefresh} isFetching={isFetching} />
    )
  }

  return NewComponent
}

export default TasksLists