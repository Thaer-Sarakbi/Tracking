import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamsList } from '../AppStack';
import { StackNavigationProp } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../assets/Colors';
import { getTask } from '../redux/tasksSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { TasksState } from '../types/types';
import { StyleSheet } from 'react-native';
import StatusModal from '../components/StatusModal';

interface Props {
  route: RouteProp<RootStackParamsList, "TaskDetails">
  navigation: StackNavigationProp<RootStackParamsList, "TaskDetails">
}

const TaskDetailsScreen = ({ route, navigation } : Props) => {

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const task = useSelector((state: TasksState) => state.tasks.task)
  const status = useSelector((state: TasksState) => state.tasks.status)

  const [taskStatus, setTaskStatus] = useState<string>(task.status)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getTask(route.params.taskId))
  },[])

  const getStyle = (status: string) => {
    console.log(status)
    if(status === 'In Progress'){
      return{
        borderColor: '#64DD17',
        color: '#64DD17',
      }
    } else if(status === 'Not Started'){
      return{
        borderColor: '#5C6BC0',
        color: '#5C6BC0',
      }
    }
  }

  const changeModalVisible = (bool: boolean) => {
    setIsModalVisible(bool)
  }

  const updateStatus = useMemo(() => {
    return(
      <View style = {{ backgroundColor: 'white', width: '100%', height: 50, position: 'absolute', bottom: 0 }}>
        <TouchableOpacity>
          <Text>UPDATE</Text>
        </TouchableOpacity>
      </View>
    )
  },[task])

  if(status === 'loading'){
    return <View/>
  } else if(status === 'succeeded'){
    return (
      <>
        <View style={{ backgroundColor: Colors.main, width: '100%', height: 80, justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left-bold-circle-outline" size={25} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>{task.title}</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.card}>
              <Text style={{ fontSize: 17, marginBottom: 10 }}>Creation Date</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{task.creationDate}</Text>
            </View>
            <View style={styles.card}>
              <Text style={{ fontSize: 17, marginBottom: 10 }}>Duration</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{task.duration} days</Text>
            </View>
          </View>

          <View style={{ backgroundColor: 'white', marginTop: 10, borderRadius: 5, padding: 10}}>
            <Text style={{ fontWeight: 'bold', color: Colors.titles, fontSize: 30 }}>Description</Text>
            <Text style={styles.decription}>{task.description}</Text>
          </View>

          <View style={{ backgroundColor: 'white', marginTop: 10, borderRadius: 5, padding: 10}}>
            <Text style={styles.title}>Status</Text>
            <TouchableOpacity 
              style={[styles.button, getStyle(taskStatus)]}
              onPress={() => changeModalVisible(true)}
            >
              <Text style={[styles.decription, getStyle(taskStatus)]}>{taskStatus}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          transparent= {true}
          animationType= 'fade'
          visible= {isModalVisible}
          onRequestClose={() => changeModalVisible(false)}
        >
          <StatusModal
            changeModalVisible= {changeModalVisible}
            isModalVisible={isModalVisible}
            setData={setTaskStatus}
          />
        </Modal>

        {updateStatus}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    paddingHorizontal: 10
  },
  title: {
    fontSize: 30,
    color: Colors.titles,
    marginVertical: 20
  },
  card:{
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 5,
    padding: 10
  },
  decription:{
    fontSize: 15
  },
  button:{
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    borderWidth: 1,
    height: 50,
    borderRadius: 5
  }
})
export default TaskDetailsScreen;