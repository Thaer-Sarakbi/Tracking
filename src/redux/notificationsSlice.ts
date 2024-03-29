import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { Notification, notificationsList } from '../types/types';

export const getNotifications = createAsyncThunk("notifications/getNotifications", async (userId: string) => {
  // let notificationsList: Array<Notification> = []

  //   await firestore()
  //   .collection('users')
  //   .doc(userId)
  //   .collection('notifications')
  //   .orderBy('creationDateNotification', "desc")
  //   .onSnapshot(snapshot => {
  //     // res.docs.forEach(snapshot => {
  //     //   // snapshot.data().id = snapshot.id
  //     //   console.log(snapshot.data())
  //     //   // notificationsList.push(snapshot.data() as any) 

  //     // })

  //     const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //     notificationsList = newData;
  //   })
    // .then(querySnapshot => { 
    //   querySnapshot.docs.forEach(documentSnapshot => {
    //     documentSnapshot.data().id = documentSnapshot.id
    //     notificationsList.push(documentSnapshot.data() as any) 
    //   });
    // }).catch((error) => {
    //   console.log(error)
    // });
  // console.log(notificationsList)
  // return notificationsList
})

export const updateNotifications = createAsyncThunk("notifications/updateNotifications", async (id:{notificationId: string, userId: string, read: boolean}) => {
  if(!id.read){
    await firestore()
    .collection('users')
    .doc(id.userId)
    .collection('notifications')
    .doc(id.notificationId)
    .update({
      read: true
    })
    .then(() => {
      console.log('updated')
    }).catch((e) => {
      console.log(e)
    });
  }
})

export const addNotification = createAsyncThunk("notifications/updateNotification", async(notification:{notification: Notification}) => {
    await firestore().collection('users').doc(notification.notification.receiverId).collection('notifications').add(
    notification.notification
  ).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
})

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    data: [],
    status: '',
    error: undefined
  } as notificationsList,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getNotifications.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.data = payload
      })
      .addCase(getNotifications.rejected, (state, action) => {
        console.log(action)
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export default notificationsSlice