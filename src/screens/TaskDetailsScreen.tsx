import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { RootStackParamsList } from '../AppStack';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../assets/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { History, Task, Updates } from '../types/types';
import StatusModal from '../components/StatusModal';
import firestore from '@react-native-firebase/firestore'
import { getTasks, updateTask } from '../redux/tasksSlice';
import AwesomeAlert from 'react-native-awesome-alerts';
import Icon from 'react-native-vector-icons/Ionicons';
import { getHistory } from '../redux/historySlice';
import { FlatList } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view'
import PushNotification from 'react-native-push-notification';
import { getNotifications } from '../redux/notificationsSlice';
import Timeline from 'react-native-timeline-flatlist';
import { getUpdates } from '../redux/updatesSlice';
import UpdateModal from '../components/UpdateModal';
import MapView from "react-native-maps";

interface Props {
  route: RouteProp<RootStackParamsList, "TaskDetails">
  navigation: StackNavigationProp<RootStackParamsList, "TaskDetails">
}
 
interface historyState {
  history: {
    data: Array<History>,
    status: string,
    error: string
  }
}

interface updatesState {
  updates: {
    data: Array<Updates>,
    status: string,
    error: string
  }
}

const TaskDetailsScreen = ({ route, navigation } : Props) => {

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [taskStatus, setTaskStatus] = useState<string>('')
  const [task, setTask] = useState<Task | null>(null)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  const history = useSelector((state: historyState) => state.history.data)
  const status = useSelector((state: historyState) => state.history.status)

  const updates = useSelector((state: updatesState) => state.updates?.data)
  const statusUpdates = useSelector((state: updatesState) => state.updates?.status)

  // updates.sort((a, b) => b.time - a.time)

  const dispatch = useDispatch<AppDispatch>()

  if(status === 'succeeded'){
    //  dispatch(updateNotifications(id))
  }

  const id = route.params.taskId
  const userId = route.params.userId
  const userName = route.params.userName

  useEffect(() => {
    firestore().collection('users').doc(userId).collection('tasks').doc(id).get()
    .then(documentSnapshot => { 
      if (documentSnapshot.exists) {
        setTask(documentSnapshot.data())
      }
    });

    dispatch(getHistory({taskId: id, userId})).then(() => {

    })

    dispatch(getUpdates({taskId: id, userId}))
  },[isModalVisible])

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

  const addNotification = async (message: string, title: string | undefined) => {

    await firestore().collection('users').doc(userId).collection('notifications').add({
      message,
      read: false,
      task: task?.title,
      title,
      taskId: id,
      // creationDate: moment().format('MMM Do YYYY, hh:mm a')
      creationDate: new Date()
    }).then(res => {
      dispatch(getNotifications(userId))
    }).catch(err => {
      console.log(err)
    })
  }

  const handleNotification = (status: string) => {
    const message = `Status Updated to ${status}`
    const title = task?.title

    PushNotification.localNotification({
      channelId: "update-status",
      title: "Update Status",
      message: message,
      task: title,
      vibrate: true, // (optional) default: true
      vibration: 300,
      screen: 'TaskDetails' 
    });

    PushNotification.popInitialNotification((notification) => {
      console.log('Initial Notification', notification);
    });

    addNotification(message, title)
  }

  const changeModalVisible = (bool: boolean) => {
    setIsModalVisible(bool)

    // Geolocation.getCurrentPosition(info => {
    //   setLatitude(info.coords.latitude)
    //   setLongitude(info.coords.longitude)
    // }, (err) => {
      // //console.log(err.code, err.message);
      //   setEnable(false)
      //   RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      //     interval: 10000,
      //     fastInterval: 5000,
      //   })
      //     .then((data) => {
      //       setEnable(true)
      //     })
      //     .catch((err) => {
      //       setEnable(true)
      //     });
    // }); 
  }

  const onChangeStatus = () => {
    setShowAlert(true)
  }

  const onAddUpdate = (bool: boolean) => {
    setUpdateModalVisible(bool)
  }

  if(task === null){
    return <View/>
  } else {
    return (
      <ScrollView>
        <View style={{ backgroundColor: Colors.main, width: '100%', height: 50, justifyContent: 'center', paddingLeft: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={30} color={'white'} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>{task.title}</Text>
          <View style={[styles.card, { marginBottom: 10 }]}>
              <Text style={{ fontSize: 17, marginBottom: 10 }}>Assign To:</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{userName}</Text>
            </View>
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

        <View style={{ backgroundColor: 'white', marginTop: 10, borderRadius: 5, padding: 10}}>
          <Text style={{ fontWeight: 'bold', color: Colors.titles, fontSize: 30 }}>Updates</Text>
          {
            statusUpdates === 'loading' ? (
              <View/>
            ) : (
              <>
                <Timeline
                  onEventPress={(update) => navigation.navigate('UpdateDetails', { navigation, update })}
                  data={updates}
                  circleSize={20}
                  circleColor='rgb(45,156,219)'
                  lineColor='rgb(45,156,219)'
                  separator={true}
                  timeContainerStyle={{minWidth:52, marginTop: 10 }}
                  timeStyle={{textAlign: 'center', backgroundColor:'#ff9797', color:'white', padding:5, borderRadius:13}}
                  descriptionStyle={{color:'gray'}}
                  options={{
                    style:{paddingTop:5}
                  }}
                  isUsingFlatlist={true}
                />

                <TouchableOpacity style={styles.updateButton} onPress={() => onAddUpdate(true)}>
                  <Text style={{ fontSize: 20, color: 'white' }}>Add Update</Text>
                </TouchableOpacity>

                <Modal
                  transparent= {true}
                  animationType= 'fade'
                  visible= {updateModalVisible}
                  onRequestClose={() => onAddUpdate(false)}
                >
                  <UpdateModal 
                    changeModalVisible= {onAddUpdate}
                    isModalVisible={updateModalVisible}
                    id={id}
                    userId={userId}
                  />
                </Modal>
              </>
            )
          }
        </View>

        {/* <View style={{ width: '100%', height: 100 }}> */}
        <MapView
        style={{ width: '100%', height: 300, marginVertical: 10, borderRadius: 5 }}
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
/>
        {/* </View> */}

          {status === 'loading' ? (
            <View />
          ) : (history.length === 0 ? (
            null) : (
              <View style={{ backgroundColor: 'white', marginTop: 10, borderRadius: 5, padding: 10}}>
                <Text style={{ fontWeight: 'bold', color: Colors.titles, fontSize: 30 }}>History</Text>
                <FlatList
                  data={history}
                  ItemSeparatorComponent={() => <View style={{ height: 1, width: '100%',backgroundColor: 'black', marginVertical: 5 }} />}
                  renderItem={(item) => {
                    return(
                      <View>
                        <Text>{item.item.updatDate}</Text>
                        <Text>{item.item.status}</Text>
                      </View>
                    )
                  }}
                />
              </View>
            )
          )}
          
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
            dispatch(updateTask({ id, status: task?.status, userId }))
            dispatch(getTasks(userId))
            dispatch(getHistory({taskId: id, userId}))
            setShowAlert(false)
            handleNotification(taskStatus)
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

     
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    paddingHorizontal: 10,
    paddingBottom: 15
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
  },
  map:{
    ...StyleSheet.absoluteFillObject,
    height: 100,
    width: '100%'
  }
})
export default TaskDetailsScreen;