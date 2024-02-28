import React, { useState, useEffect } from 'react';
import { FlatList, Task, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Card from '../components/Card';
import AnimatedLottieView from 'lottie-react-native';

interface Props {
  tasks: Task[],
  navigation: {navigate: (screen: string,task: Task) => void}
}

function InProgressTasksScreen ({ navigation, tasks } : Props){
    const status = useSelector((state: MyState) => state.tasks.status)
  
    const [isFetching, setIsFetching] = useState(false)

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
              renderItem={({item}) => {
                  if(item.status === 'In Progress'){
                      return(
                          <TouchableOpacity onPress={() => { navigation.navigate('TaskDetails', {
                            taskId: item.id,
                            assignedTo: item.assignedTo,
                            status: item.status,
                            creationDate: item.creationDate,
                            title: item.title,
                            latitude: item.latitude,
                            longitude: item.longitude,
                            description: item.description,
                            duration: item.duration,
                            assignedBy: item.assignedBy,
                            assigenId: item.assigenId
                          })}} >
                            <Card item={item} />
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