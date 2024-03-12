import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { Updates } from '../types/types';

interface UpdatesState {
  data: Updates[],
  status: string,
  error: string | undefined
}

export const getUpdates = createAsyncThunk("updates/getUpdates", async (user:{taskId: string, userId: string}) => {
    let updatesList: any = []

    firestore()
    .collection('users')
    .doc(user.userId)
    .collection('tasks')
    .doc(user.taskId)
    .collection('updates')
    .orderBy('time', "desc")
    .onSnapshot(snapshot => {
      updatesList =  snapshot.docs.map((doc) => ({ updateId: doc.id, ...doc.data() }));
      // setUpdates(newData);
      // updatesList = updatesList1
    })

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
    error: ''
  } as UpdatesState,
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