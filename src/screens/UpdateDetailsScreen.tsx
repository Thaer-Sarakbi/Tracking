import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, Text, View, LogBox, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import HeaderDetails from '../components/HeaderDetails';
import { StyleSheet, Keyboard } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import { Colors } from '../assets/Colors';
import ImageView from "react-native-image-viewing";
import { RouteProp } from '@react-navigation/native';
import { RootStackParamsList } from '../navigation/AppStack';
import { StackNavigationProp } from '@react-navigation/stack';
import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore'
import Icon from 'react-native-vector-icons/Ionicons';
import NotificationService from '../services/NotificationService';
import PushNotification from 'react-native-push-notification';
import { addNotification } from '../redux/notificationsSlice';
import LottieView from 'lottie-react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { deleteUpdate } from '../redux/updatesSlice';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  
interface Props {
  route: RouteProp<RootStackParamsList, "UpdateDetails">
  navigation: StackNavigationProp<RootStackParamsList, "UpdateDetails">
}
 
 
const UpdateDetailsScreen = ({ route, navigation } : Props) => {
  const [isVisible, setIsVisible] = useState(false)
  const [index, setIndex] = useState(0)
  const [chat, setChat] = useState()
  const [comment, setComment] = useState('')
  const [showAlert, setShowAlert] = useState<boolean>(false)

  const user = useSelector((state: notificationsState) => state.auth.user)

  const dispatch = useDispatch<AppDispatch>()

  const taskId = route.params.taskId
  const updateId = route.params.updateId
  const assigenId = route.params.assigenId
  const deviceToken = route.params.deviceToken
  const creationDate = route.params.time
  const title = route.params.title
  const description = route.params.description
  const updatedBy = route.params.updatedBy
  const images = route.params.images

  console.log(taskId, updateId, assigenId, deviceToken)

  useEffect(() => {
    retreiveChat()
  },[])

  const retreiveChat = async () => {
    firestore()
    .collection('users')
    .doc(assigenId)
    .collection('tasks')
    .doc(taskId)
    .collection('updates')
    .doc(updateId)
    .collection('chat')
    .orderBy('creationDate', "desc")
    .onSnapshot(snapshot => {
      const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChat(newData);
    })
  }

  const onDeleteUpdate = () => {
    setShowAlert(false)
    dispatch(deleteUpdate({ id: updateId, taskId, assigenId  }))
    // dispatch(getTasks({id: userId, admin}))
    navigation.goBack()
  }

  const handleNotification = async(message, taskId, updateId, assigenId) => {
    // PushNotification.localNotification({
    //   channelId: "update-status",
    //   taskId,
    //   updateId,
    //   assigenId
    // });
  
    // PushNotification.popInitialNotification((notification) => {
    //   console.log('Initial Notification', notification);
    // });
  
    let notificationData = {
      data: {
        screen: 'UpdateDetails',
        taskId,
        update:{id: updateId, images},
        assigenId
      },
      title: 'Comment',
      body: message,
      token: deviceToken
    };
  
    await NotificationService.sendSingleDeviceNotification(notificationData);
  }

  const sendNotification = async() => {
    const message = `${user.name} commented on you update`

    // if(user.admin){
    //   await firestore().collection('users').doc(assigenId).collection('notifications').add({
    //     message,
    //     read: false,
    //     taskId,
    //     updateId,
    //     assigenId
    // }).then(res => {
    //   handleNotification(message, taskId, updateId, assigenId)
    // }).catch(err => {
    //   console.log(err)
    // })
    // } else {
    //   await firestore().collection('users').doc('D7WNpRZb6d1j0WjuDtEJ').collection('notifications').add({
    //     message,
    //     read: false,
    //     taskId,
    //     updateId,
    //     assigenId
    // }).then(res => {
    //   handleNotification(message, taskId, updateId, assigenId)
    // }).catch(err => {
    //   console.log(err)
    // })
    // }

    handleNotification(message, taskId, updateId, assigenId)
  }

  const onSubmitComment = async () => {
    setComment('')
    Keyboard.dismiss()

    await firestore()
    .collection('users')
    .doc(assigenId)
    .collection('tasks')
    .doc(taskId)
    .collection('updates')
    .doc(updateId)
    .collection('chat')
    .add({
      creationDate: new Date(),
      commenter: user.name,
      comment
    }) 
    .then((res) => {    
      if(user.admin){
        dispatch(addNotification({notification:{
          screen: 'UpdateDetails',
          message: `${user.name} added a new comment`,
          read: false,
          taskId,
          time: creationDate,
          creationDateNotification: new Date(),
          updateId,
          images,
          title,
          description,
          updatedBy,
          assigenId,
          receiverId: assigenId
      }}))
      } else {
        dispatch(addNotification({notification:{
          screen: 'UpdateDetails',
          message: `${user.name} added a new comment`,
          read: false,
          taskId,
          time: creationDate,
          creationDateNotification: new Date(),
          updateId,
          images,
          title,
          description,
          updatedBy,
          assigenId,
          receiverId: 'D7WNpRZb6d1j0WjuDtEJ'
      }}))
      }
      retreiveChat()
    }).catch((error) => { 
      console.log(error)
    });
  }

  const images1 = images?.map((image: string) => {
    return( 
      `https://firebasestorage.googleapis.com/v0/b/tracking-6569e.appspot.com/o/${image?.substring(image.lastIndexOf('/') + 1)}?alt=media&token=${user.deviceToken}`
    )
    // console.log(`https://firebasestorage.googleapis.com/v0/b/tracking-6569e.appspot.com/o/${image.path.slice(64)}?alt=media&token=${user.deviceToken}`)
   
  })
  
  const images2 = images?.map((image : string) => {
    return(
        { uri: `https://firebasestorage.googleapis.com/v0/b/tracking-6569e.appspot.com/o/${image?.substring(image.lastIndexOf('/') + 1)}?alt=media&token=${user.deviceToken}`}
    )
  }) 
 
  if(route){
    return (
      <>
        <ScrollView style={{ flex: 1, marginBottom: 60 }}>
          {/* <HeaderDetails navigation={navigation}/> */}
          <View style={{ backgroundColor: Colors.main, width: '100%', height: 50, justifyContent: 'space-between', paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-outline" size={35} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAlert(true)} style={{ backgroundColor: 'red', width: 70, height: 35, alignItems: 'center', justifyContent: 'center', marginRight: 10, borderRadius: 10 }}>
              <Text style={{ color: 'white', fontSize: 17 }}>Delete</Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.decription}>{description}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Updated By: </Text>
              <Text style={{ fontSize: 15 }}> {updatedBy}</Text>
            </View>       
          </View>

          {images && (<SliderBox
            images={images1}
            sliderBoxHeight={400}
            firstItem={index}
            onCurrentImagePressed={(index: number) => {
              setIsVisible(true)
              setIndex(index)
            }}
           />)}

          {images && (<ImageView
            images={images2}
            imageIndex={index}
            visible={isVisible}
            onRequestClose={() => setIsVisible(false)}
            onImageIndexChange={(i) => setIndex(i)}
           />)}

           {chat && (<Text style={{ color: Colors.titles, fontSize: 25, margin: 10 }}>Comments:</Text>)}
           {
            chat?.map((message, index) => (
              <View key={index} style={{ marginHorizontal: 10, borderRadius: 10, borderTopColor: 'black', marginVertical: 5, padding: 5, backgroundColor: 'white' }}>
                <Text style={{ color: Colors.titles, fontSize: 20 }}>{message.commenter}</Text>
                <Text style={{ color: Colors.texts, fontSize: 15 }}>{message.comment}</Text>
              </View>
            ))
           }


        </ScrollView>
        <View style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: Colors.texts, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
             <TextInput
               value={comment}
               onChangeText={(text) => setComment(text)}
               onSubmitEditing={Keyboard.dismiss}
               style={{ flex: 1, backgroundColor: 'white', borderRadius: 10, marginVertical: 5, marginRight: 5, fontSize: 15 }}
             />
             <TouchableOpacity 
               onPress={() => onSubmitComment()}
               style={{ backgroundColor: Colors.main, borderRadius: 50, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}
             >
               <Icon name="send-outline" size={25} color={'white'}  />
             </TouchableOpacity>
           </View>

           <AwesomeAlert
              show={showAlert}
              showProgress={false}
              title="Alert"
              message="Are you sure you want to delete this task?"
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
                // dispatch(updateTask({ id, status: taskStatus, userId: assigenId, updaterName: user.name }))
                onDeleteUpdate()
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
      </>
      );
  } else {
    return(
      <>
        <LottieView source={require("../assets/loading2.json")} style={{flex: 1}} autoPlay loop />
      </>
    )
  }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: Colors.titles,
        marginVertical: 20
      },
      decription:{
        fontSize: 15
      },
  })

export default UpdateDetailsScreen;