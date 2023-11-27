import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { Notification, notificationsList } from '../types/types';

export const getNotifications = createAsyncThunk("notifications/getNotifications", async (userId: string) => {
  let notificationsList: Array<Notification> = []

  await firestore()
        .collection('users')
        .doc(userId)
        .collection('notifications')
        .orderBy('creationDate')
        .get()
        .then(querySnapshot => { 
          querySnapshot.docs.forEach(documentSnapshot => {
            documentSnapshot.data().id = documentSnapshot.id
            notificationsList.push(documentSnapshot.data() as any) 
          });
        }).catch((error) => {
          console.log(error)
        });

      return notificationsList
})

export const updateNotifications = createAsyncThunk("notifications/updateNotifications", async (id:{notificationId: string, userId: string}) => {
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