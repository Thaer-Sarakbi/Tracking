import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { History, historyList } from '../types/types';
import moment from 'moment';

export const getHistory = createAsyncThunk("history/getHistory", async (id: string) => {
  let historyList: Array<History> = []

  await firestore().collection('users').doc('ArBP1hNGf2ScyBjdiDfE').collection('tasks').doc(id).collection('history').get()
  .then(querySnapshot => { 
    querySnapshot.docs.forEach(documentSnapshot => {
      console.log('got')
        // documentSnapshot.data().id = documentSnapshot.id
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