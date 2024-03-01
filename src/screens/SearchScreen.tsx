import React, { useState } from "react"
import { FlatList, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"
import Card from "../components/Card"
import SearchBox from "../components/SearchBox"
import firestore from '@react-native-firebase/firestore'
import { Task, UserState, tasks } from "../types/types"
import { RouteProp } from "@react-navigation/native"
import { RootStackParamsList } from "../navigation/AppStack"
import { StackNavigationProp } from "@react-navigation/stack"

interface Props{
  route: RouteProp<RootStackParamsList, "search">
  navigation: StackNavigationProp<RootStackParamsList, "search">
}

const SearchScreen = ({ navigation, route } : Props) => {
    const [tasksList, setTasksList] = useState(route.params.tasks)

    const user = route.params.user

    const users = useSelector((state: UserState) => state.users.data)

    const onChangeText = async(text: string) => {
        let filteredList: Task[] = []

      if(user.admin){
        const usersCollection = await firestore().collection('users')

        const usersQuerySnapshot = await usersCollection.get()
        let usersDataWithTasks = []
      
        for(const userDoc of usersQuerySnapshot.docs){
          const userTasksCollection = userDoc.ref.collection('tasks').orderBy('searchTitle').startAt(text.toLowerCase()).endAt(text.toLowerCase() + '\uf8ff')
      
          const tasksQuerySnapshot = await userTasksCollection.get()
      
          const tasksData = tasksQuerySnapshot.docs.map((taskDoc) => ({
            id: taskDoc.id,
            ...taskDoc.data()
          }))
      
          console.log(tasksData)
          if(tasksData){
            usersDataWithTasks.push(
              // id: userDoc.id,
              // userData: userDoc.data(),
              ...tasksData
            )
          }
  
          filteredList = usersDataWithTasks
          setTasksList(filteredList)
        }
      } else {
        await firestore()
        .collection('users')
        .doc(user.id)
        .collection('tasks')
        .orderBy('searchTitle')
        .startAt(text.toLowerCase())
        .endAt(text.toLowerCase() + '\uf8ff')
        .get()
        .then(querySnapshot => { 
            querySnapshot.docs.forEach((documentSnapshot) => {
              documentSnapshot.data().id = documentSnapshot.id
              filteredList.push(documentSnapshot.data() as tasks)
            })
        });
      }
        
  

        setTasksList(filteredList)
    }

    return(
        <View style={{ flex: 1 }}>
        <SearchBox navigation={navigation} onChangeText={onChangeText}/>
        <FlatList
          keyExtractor={(item) => item?.id.toString()}
          data={tasksList}
          renderItem={(item) => {
            if(item.item?.status !== 'Completed'){
              const assigned = users.find(user => {
    
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
                  deviceToken: assigned.deviceToken
                })}} >
                  <Card item={item.item} />
                </TouchableOpacity>
              )
            } else {
              return null
            }
          }}
        />
    </View>
    )
}
  
  export default SearchScreen