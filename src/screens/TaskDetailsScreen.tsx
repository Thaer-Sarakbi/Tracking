import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Text, TouchableOpacity, View, Button } from 'react-native';
import { RootStackParamsList } from '../AppStack';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../assets/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { Task } from '../types/types';
import { StyleSheet } from 'react-native';
import StatusModal from '../components/StatusModal';
import firestore from '@react-native-firebase/firestore'
import { getTasks, updateTask } from '../redux/tasksSlice';
import AwesomeAlert from 'react-native-awesome-alerts';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  route: RouteProp<RootStackParamsList, "TaskDetails">
  navigation: StackNavigationProp<RootStackParamsList, "TaskDetails">
}

const TaskDetailsScreen = ({ route, navigation } : Props) => {

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [taskStatus, setTaskStatus] = useState()
  const [task, setTask] = useState<Task | null>(null)
  const [showAlert, setShowAlert] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>()

  const id = route.params.taskId
  useEffect(() => {
    firestore().collection('users').doc('ArBP1hNGf2ScyBjdiDfE').collection('tasks').doc(id).get()
    .then(documentSnapshot => { 
      
      if (documentSnapshot.exists) {
        setTask(documentSnapshot.data())
      }
    });
  },[])

  useEffect(() => {
    setTask({ ...task, status: taskStatus })
  },[taskStatus])

  const getStyle = (status: string) => {
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
    } else if(status === 'Completed'){
      return{
        borderColor: 'red',
        color: 'red',
      }
    }
  }

  const changeModalVisible = (bool: boolean) => {
    setIsModalVisible(bool)
  }

  const onChangeStatus = () => {
    setShowAlert(true)
  }

  if(task === null){
    return <View/>
  } else {
    return (
      <>
        <View style={{ backgroundColor: Colors.main, width: '100%', height: 50, justifyContent: 'center', paddingLeft: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={30} color={'white'} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>{task.title}</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.card}>
              <Text style={{ fontSize: 17, marginBottom: 10 }}>Creation Date:</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{task.creationDate}</Text>
            </View>
            <View style={styles.card}>
              <Text style={{ fontSize: 17, marginBottom: 10 }}>Duration:</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{task.duration} days</Text>
            </View>
          </View>

          <View style={{ backgroundColor: 'white', marginTop: 10, borderRadius: 5, padding: 10}}>
            <Text style={{ fontWeight: 'bold', color: Colors.titles, fontSize: 30 }}>Description</Text>
            <Text style={styles.decription}>{task.description}</Text>
          </View>

          <View style={{ backgroundColor: 'white', marginTop: 10, borderRadius: 5, padding: 10}}>
            <Text style={{ fontWeight: 'bold', color: Colors.titles, fontSize: 30 }}>Status</Text>
            <TouchableOpacity 
              style={[styles.button, getStyle(task.status)]}
              onPress={() => changeModalVisible(true)}
            >
              <Text style={[styles.decription, getStyle(task.status)]}>{task.status}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.updateButton} onPress={() => onChangeStatus()}>
          <Text style={{ fontSize: 20, color: 'white' }}>Update</Text>
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

        <View>

        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Alert"
          message="Are you sure you want to update status?"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No"
          confirmText="Yes"
          confirmButtonColor= {Colors.main}
          onCancelPressed={() => {
            setShowAlert(false)
          }}
          onConfirmPressed={() => {
            dispatch(updateTask({ id, status: task?.status }))
            dispatch(getTasks())
            setShowAlert(false)
          }}
          contentContainerStyle={{
            width: '70%'
          }}
          titleStyle={{
            fontSize: 30,
            fontWeight: 'bold'
          }}
          messageStyle={{
            fontSize: 20,
          }}
          confirmButtonStyle={{
            width: 60,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          cancelButtonStyle={{
            width: 60,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          confirmButtonTextStyle={{
            fontSize: 15
          }}
          cancelButtonTextStyle={{
            fontSize: 15
          }}
        />
      </View>
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
    borderRadius: 5,
    marginVertical: 10
  },
  updateButton:{
    backgroundColor: Colors.main,
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  alertContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  alertButton: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: "#AEDEF4",
  },
  alertText: {
    color: '#fff',
    fontSize: 15
  }
})
export default TaskDetailsScreen;