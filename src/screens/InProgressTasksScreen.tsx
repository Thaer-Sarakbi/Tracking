import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import { ListsProps, User } from '../types/types';
import LottieView from 'lottie-react-native';

const InProgressTasksScreen = ({ navigation, tasks, status, users } : ListsProps) => {

    if(status === 'loading'){
      return (
        <>
          <LottieView source={require("../assets/loading.json")} style={{flex: 1}} autoPlay loop />
        </>
      )
    } else if(status === 'succeeded'){
      return (
        <View>
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              data={tasks}
              renderItem={({ item, index }) => {
                    const assigned = users.find((user: User) => {
          
                      if(user.value === item.assignedTo){
                        return user
                      }
                    })

                      const isEnd = index === tasks.length - 1;
                      return(
                          <TouchableOpacity style={{ marginBottom: isEnd ? 10 : 0 }} onPress={() => { navigation.navigate('TaskDetails', {
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
              }}
            />
        </View>
      );
    }
}

export default InProgressTasksScreen;