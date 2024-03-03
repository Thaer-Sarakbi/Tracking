import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { getTasks } from '../redux/tasksSlice';
import { ListsProps, User, UserState } from '../types/types';
import Card from '../components/Card';
import LottieView from "lottie-react-native";

const NotStartedScreen = ({ navigation, users, tasks, status } : ListsProps) => {

  const user = useSelector((state: UserState) => state.auth.user)

  const [isFetching, setIsFetching] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const onRefresh = () => {
    setIsFetching(true)
    dispatch(getTasks({id: user.id, admin: user.admin}))
    setIsFetching(false)
  }

  useEffect(() => {
    dispatch(getTasks({id: user?.id, admin: user?.admin}))
    
    const interval = setInterval(() => {
      
      dispatch(getTasks({id: user?.id, admin: user?.admin}))
    }, 30000);

    return () => clearInterval(interval)
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
                renderItem={({ item }) => {
                  if(item?.status == 'Not Started'){
                    const assigned = users.find((user: User) => {
          
                      if(user.value === item.assignedTo){
                        return user
                      }
                    })
                    return(
                      <TouchableOpacity onPress={() => { navigation.navigate('TaskDetails', {
                        id: item.id,
                        assignedTo: item.assignedTo,
                        status: item.status,
                        creationDate: item.creationDate,
                        title: item.title,
                        latitude: item.latitude,
                        longitude: item.longitude,
                        description: item.description,
                        duration: item.duration,
                        assigenId: item.assigenId,
                        assignedBy: item.assignedBy,
                        location: item.location,
                        deviceToken: assigned?.deviceToken
                      })}} >
                        <Card item={item} />
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

export default NotStartedScreen;