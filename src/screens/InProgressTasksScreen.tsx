import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getTasks } from '../redux/tasksSlice';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../components/Card';
import AnimatedLottieView from 'lottie-react-native';

function InProgressTasksScreen ({ navigation, tasks }){
    // const tasks = useSelector((state: MyState) => state.tasks.data)
    const status = useSelector((state: MyState) => state.tasks.status)
    const user = useSelector((state: MyState) => state.auth.user)
  
    const [isFetching, setIsFetching] = useState(false)
  
    const dispatch = useDispatch<AppDispatch>()
  
    // const onRefresh = () => {
    //   setIsFetching(true)
    //   dispatch(getTasks({id: user?.id, admin: user?.admin}))
    //   setIsFetching(false)
    // }
  
    // useEffect(() => {
    //   dispatch(getTasks({id: user?.id, admin: user?.admin}))
  
      // createChannels()
    // },[])

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
                  if(item.item.status === 'In Progress'){
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
                            assigenId: item.item.assigenId
                          })}} >
                            <Card item={item.item} />
                          </TouchableOpacity>
                      )
                  } else {
                      return null
                  }
              }}
              // onRefresh= {() => onRefresh()}
              refreshing={isFetching}
            />
        </View>
      );
    }
}

export default InProgressTasksScreen