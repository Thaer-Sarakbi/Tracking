import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { History, historyList } from '../types/types';

export const getHistory = createAsyncThunk("history/getHistory", async (id:{taskId: string, userId: string}) => {
  let historyList: Array<History> = []
  console.log(id.taskId, id.userId)
  await firestore()
        .collection('users')
        .doc(id.userId)
        .collection('tasks')
        .doc(id.taskId)
        .collection('history')
        .orderBy('updateDate')
        .get()
        .then(querySnapshot => { 
          querySnapshot.docs.forEach(documentSnapshot => {
            historyList.push(documentSnapshot.data() as any) 
          });
        }).catch((error) => {
          console.log(error)
        });

      return historyList
})

const historySlice = createSlice({
  name: 'history',
  initialState: {
    data: [],
    status: '',
    error: undefined
  } as historyList,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getHistory.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getHistory.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.data = payload
      })
      .addCase(getHistory.rejected, (state, action) => {
        console.log(action)
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export default historySlice