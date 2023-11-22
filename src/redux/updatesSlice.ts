import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { History, historyList, Updates } from '../types/types';
import moment from 'moment';

export const getUpdates = createAsyncThunk("updates/getUpdates", async () => {
    let updatesList: Array<Updates> = []

    await firestore().collection('users').doc('ArBP1hNGf2ScyBjdiDfE').collection('updates').get()
    .then(querySnapshot => { 
      querySnapshot.docs.forEach(documentSnapshot => {
          // documentSnapshot.data().id = documentSnapshot.id
          updatesList.push(documentSnapshot.data() as any) 
      });
    }).catch((error) => {
      console.log(error)
    });

    return updatesList
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