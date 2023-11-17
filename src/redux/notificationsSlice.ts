import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { Notification, notificationsList } from '../types/types';

export const getNotifications = createAsyncThunk("notifications/getNotifications", async () => {
  let notificationsList: Array<Notification> = []

  await firestore().collection('users').doc('ArBP1hNGf2ScyBjdiDfE').collection('notifications').get()
  .then(querySnapshot => { 
    console.log(querySnapshot)
    querySnapshot.docs.forEach(documentSnapshot => {
        // documentSnapshot.data().id = documentSnapshot.id
        notificationsList.push(documentSnapshot.data() as any) 
    });
  }).catch((error) => {
    console.log(error)
  });

  return notificationsList
})

export const updateNotifications = createAsyncThunk("notifications/updateNotifications", async (notification: { id: string}) => {
    await firestore()
    .collection('users')
    .doc('ArBP1hNGf2ScyBjdiDfE')
    .collection('notifications')
    .doc(notification.id)
    .update({
      read: true
    })
    .then(() => {
      console.log('updated')
    //   firestore().collection('users').doc('ArBP1hNGf2ScyBjdiDfE').collection('tasks').doc(task.id).collection('history').add({
    //   status: task.status,
    //   updatDate: moment().format('MMM Do YYYY, hh:mm a')
    //   }).then(() => {
    //     console.log('history created')
    //   })
    }).catch((e) => {
      console.log(e)
    });
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