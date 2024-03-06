import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet, FlatList, Platform, ActivityIndicator } from 'react-native';
import { RootStackParamsList } from '../navigation/AppStack';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../assets/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { History, Task, Updates, User, UserState } from '../types/types';
import StatusModal from '../components/StatusModal';
import firestore from '@react-native-firebase/firestore'
import { getTasks, updateTask } from '../redux/tasksSlice';
import AwesomeAlert from 'react-native-awesome-alerts';
import { getHistory } from '../redux/historySlice';
import { ScrollView } from 'react-native-virtualized-view'
import { addNotification } from '../redux/notificationsSlice';
import Timeline from 'react-native-timeline-flatlist';
import UpdateModal from '../components/UpdateModal';
import moment from 'moment';
import NotificationService from '../services/NotificationService';
import Geolocation from '@react-native-community/geolocation';
import LottieView from 'lottie-react-native';
import HeaderDetails from '../components/HeaderDetails';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import MapViewComponent from '../components/MapView';

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

const TaskDetailsScreen = ({ route, navigation } : Props) => {

  const id = route.params.id
  const assignedTo = route.params.assignedTo
  const assignedBy = route.params.assignedBy
  const title = route.params?.title
  const description = route.params.description
  const duration = route.params.duration
  const assigenId = route.params?.assigenId
  const creationDate = moment(new Date(route.params.creationDate.seconds * 1000)).format('MMMM Do YYYY, h:ss a') 
  const deviceToken = route.params.deviceToken

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [taskStatus, setTaskStatus] = useState<string>(route.params.status)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  const [latitude, setLatitude] = useState<number>(route.params.latitude)
  const [longitude, setLongitude] = useState<number>(route.params.longitude)
  const [statusLoading, setStatusLoading] = useState<boolean>(false)

  const [updates, setUpdates] = useState<any>([])

  const history = useSelector((state: historyState) => state.history.data)
  const status = useSelector((state: historyState) => state.history.status)

  const user = useSelector((state: UserState) => state.auth.user)
  
  const editUpadtes = updates.map((update: Updates) => {
    const time = moment(new Date(update.time.seconds * 1000)).format('MMM Do[\n]h:ss a')
    return{
      ...update,
      time,
      date: update.time.seconds
    }
  })

  editUpadtes.sort((a: any, b: any) => b.date - a.date )
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {

    dispatch(getHistory({taskId: id, userId: user.id, admin: user.admin}))

    const unsubscribe =  firestore()
    .collection('users')
    .doc(assigenId)
    .collection('tasks')
    .doc(id)
    .collection('updates')
    .orderBy('time', "desc")
    .onSnapshot(snapshot => {
      const newData = snapshot.docs.map((doc) => ({ updateId: doc.id, ...doc.data() }));
      setUpdates(newData);
    })

  // Unsubscribe when component unmounts
  return () => unsubscribe();
  },[])

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

  const handleNotification = async (status: string) => {
    const message = `Status Updated to ${status} by ${user.name}`

    let notificationData = {
      screen: 'TaskDetails',
      title,
      duration,
      status: taskStatus,
      // message,
      task: title,
      assignedTo,
      description,
      creationDate: new Date(route.params.creationDate.seconds * 1000),
      channelId: 'updateTaskStatus',
      channelName: 'New update Status'
    };
   
    await NotificationService.sendSingleDeviceNotification( { notification: notificationData, token: deviceToken, message });
  }

  const onUpdateTask = () => {
    Geolocation.getCurrentPosition(info => {
      dispatch(updateTask({ id, status: taskStatus, userId: assigenId, updaterName: user.name, latitude: info.coords.latitude, longitude: info.coords.longitude })).then(() => {
        if(user.admin){
          dispatch(addNotification({notification:{
            screen: 'TaskDetails',
            message: `${user.name} updated status to ${taskStatus}`,
            read: false,
            task: title,
            taskId: id,
            status: taskStatus,
            creationDate: new Date(),
            creationDateNotification: new Date(),
            title,
            description,
            assignedTo,
            duration,
            assigenId,
            receiverId: assigenId
          }})).then(() => {
            setStatusLoading(false)
          })
        } else {
          dispatch(addNotification({notification:{
            screen: 'TaskDetails',
            message: `${user.name} updated status to ${taskStatus}`,
            read: false,
            task: title,
            taskId: id,
            status: taskStatus,
            creationDate: new Date(),
            creationDateNotification: new Date(),
            title,
            description,
            assignedTo,
            duration,
            assigenId,
            receiverId: 'D7WNpRZb6d1j0WjuDtEJ'
          }})).then(() => {
            setStatusLoading(false)
          })
        }
      })

      dispatch(getTasks({id: user.id, admin: user.admin}))
      dispatch(getHistory({taskId: id, userId: user.id, admin: user.admin}))
      handleNotification(taskStatus)
      setLatitude(info.coords.latitude)
      setLongitude(info.coords.longitude)
    }, async(err) => {
      if (Platform.OS === 'android') {
        try {
          const enableResult = await promptForEnableLocationIfNeeded();
          if(enableResult === 'enabled'){
            setStatusLoading(true)
            onUpdateTask()
          }
        } catch (error: unknown) {
          console.log('error')
        }
      }
    }); 
  }

  const changeModalVisible = (bool: boolean) => {
    setIsModalVisible(bool)
  }

  const onChangeStatus = () => {
    setShowAlert(true)
  }

  const onAddUpdate = (bool: boolean) => {
    setUpdateModalVisible(bool)
  }

    return (
      <ScrollView>
        <HeaderDetails navigation={navigation} taskId={id} assigenId={assigenId} userId={user.id} admin={user.admin} />
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <View style={[styles.card, { marginBottom: 10 }]}>
              <Text style={{ fontSize: 17, marginBottom: 10 }}>Assign By:</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{assignedBy}</Text>
            </View>
          <View style={[styles.card, { marginBottom: 10 }]}>
              <Text style={{ fontSize: 17, marginBottom: 10 }}>Assign To:</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{assignedTo}</Text>
            </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.card}>
              <Text style={{ fontSize: 17, marginBottom: 10 }}>Creation Date:</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
                 {creationDate}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={{ fontSize: 17, marginBottom: 10 }}>Duration:</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{duration} days</Text>
            </View>
          </View>

          <View style={{ backgroundColor: 'white', marginTop: 10, borderRadius: 5, padding: 10}}>
            <Text style={{ fontWeight: 'bold', color: Colors.titles, fontSize: 30 }}>Description</Text>
            <Text style={styles.decription}>{description}</Text>
          </View>

          <View style={{ backgroundColor: 'white', marginTop: 10, borderRadius: 5, padding: 10}}>
            {!statusLoading ? (
              <>
                <Text style={{ fontWeight: 'bold', color: Colors.titles, fontSize: 30 }}>Status</Text>
                <TouchableOpacity 
                  style={[styles.button, getStyle(taskStatus)]}
                  onPress={() => changeModalVisible(true)}
                >
                  <Text style={[styles.decription, getStyle(taskStatus)]}>{taskStatus}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.updateButton} onPress={() => onChangeStatus()}>
                  <Text style={{ fontSize: 20, color: 'white' }}>Update</Text>
                </TouchableOpacity>
              </>) : (
                <View style={styles.loader}>
                  <ActivityIndicator size='large' />
                </View>
              )}
        </View>

        <View style={{ backgroundColor: 'white', marginTop: 10, borderRadius: 5, padding: 10}}>
          <Text style={{ fontWeight: 'bold', color: Colors.titles, fontSize: 30 }}>Updates</Text>
          {!updates ?
           (
             <View />
            ) : (
              <>
              <Timeline
                onEventPress={(update) => navigation.navigate('UpdateDetails', update )}
                data={editUpadtes}
                circleSize={20}
                circleColor='rgb(45,156,219)'
                lineColor='rgb(45,156,219)'
                separator={true}
                timeContainerStyle={{width:75, marginTop: 10 }}
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
                  userId={user.id}
                  assigenId={assigenId}
                  admin={user.admin}
                  updaterName= {user.name}
                />
              </Modal>
            </>
            )
          }
        </View>

        <MapViewComponent longitude={longitude} latitude={latitude}/>

          {status === 'loading' ? (
            <>
              <LottieView source={require("../assets/loading2.json")} style={{flex: 1}} autoPlay loop />
            </>
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
                        <Text>{moment(new Date(item.item.updateDate.seconds * 1000)).format('MMMM Do YYYY, h:ss a') }</Text>
                        <Text>{item.item.status}</Text>
                        <Text>Updated By: {item.item.updatedBy}</Text>
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
            onUpdateTask()
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
            width: 70,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          cancelButtonStyle={{
            width: 70,
            height: 40,
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
// }

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
  },
  loader:{
    marginTop: 10,
    alignItems: 'center'
  }
})
export default TaskDetailsScreen;