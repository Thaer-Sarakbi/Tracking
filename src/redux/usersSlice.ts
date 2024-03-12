import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { User } from '../types/types';

interface MyState {
  data: Array<User>
  status: string,
  error: string | undefined
}

export const getUsers = createAsyncThunk("users/getUsers", async () => {
  let usersList: any = []

  await firestore().collection('users').get()
  .then(querySnapshot => { 
    querySnapshot.docs.forEach(documentSnapshot => {
      documentSnapshot.data().id = documentSnapshot.id
      usersList.push({
        id: documentSnapshot.data().id,
        value: documentSnapshot.data().name as any,
        deviceToken: documentSnapshot.data().deviceToken as any,
      }) 
    });
  });

  return usersList
})

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    status: '',
    error: ''
  } as MyState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getUsers.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.data = payload
      })
      .addCase(getUsers.rejected, (state, action) => {
        console.log(action.error.message)
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export default usersSlice