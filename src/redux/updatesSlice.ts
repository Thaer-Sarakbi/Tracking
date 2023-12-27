import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { Updates } from '../types/types';

export const getUpdates = createAsyncThunk("updates/getUpdates", async (user:{taskId: string, userId: string, admin:boolean}) => {
    let updatesList: Array<Updates> = []

    // if(user.admin){
    //   const usersCollection = await firestore().collection('users')
  
    //   const usersQuerySnapshot = await usersCollection.get()
    //   let usersDataWithTasks = []
    
    //   for(const userDoc of usersQuerySnapshot.docs){
    //     const userUpdatesCollection = userDoc.ref.collection('tasks').doc(user.taskId).collection('updates').orderBy('time', "desc")
    
    //     const updatesQuerySnapshot = await userUpdatesCollection.get()
    
    //     const updatesData = updatesQuerySnapshot.docs.map((updateDoc) => ({
    //       id: updateDoc.id,
    //       ...updateDoc.data()
    //     }))
    
    //     if(updatesData[0]){
    //       usersDataWithTasks.push(
    //         // id: userDoc.id,
    //         // userData: userDoc.data(),
    //         ...updatesData
    //       )
    //     }
    //     updatesList = usersDataWithTasks
    //   }
    // } else {
    //   await firestore().collection('users').doc(user.userId).collection('tasks').doc(user.taskId).collection('updates').orderBy('time', "desc").get()
    //   .then(querySnapshot => { 
    //     console.log(querySnapshot.docs)
    //     querySnapshot.docs.forEach(documentSnapshot => {
    //         updatesList.push(documentSnapshot.data() as any) 
    //     });
    //   }).catch((error) => {
    //     console.log(error)
    //   });
    // }

    await firestore().collection('users').doc(user.userId).collection('tasks').doc(user.taskId).collection('updates').orderBy('time', "desc").get()
      .then(querySnapshot => { 
        console.log(querySnapshot.docs)
        querySnapshot.docs.forEach(documentSnapshot => {
            updatesList.push(documentSnapshot.data() as any) 
        });
      }).catch((error) => {
        console.log(error)
      });

    return updatesList
})

export const deleteUpdate = createAsyncThunk("tasks/deleteTask", async (update: { id: string, assigenId: string, taskId: string }) => {
  firestore()
  .collection('users')
  .doc(update.assigenId)
  .collection('tasks')
  .doc(update.taskId)
  .collection('updates')
  .doc(update.id)
  .delete()
  .then(() => {
    console.log('Update deleted!');
  }).catch((error) => {
    console.log(error)
  });
})

const updatesSlice = createSlice({
  name: 'updates',
  initialState: {
    data: [],
    status: '',
    error: undefined
  } as Updates,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getUpdates.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getUpdates.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.data = payload
      })
      .addCase(getUpdates.rejected, (state, action) => {
        console.log(action)
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export default updatesSlice