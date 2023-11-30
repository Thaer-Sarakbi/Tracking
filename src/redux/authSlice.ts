import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { User } from '../types/types';

interface MyState {
  user: User | null
  status: string
}

export const setUser = createAsyncThunk("auth/setUser",async(user: User) => {
  let userData

  await firestore().collection('users').get()
  .then(querySnapshot => { 
    querySnapshot.docs.forEach(documentSnapshot => {
      // documentSnapshot.data().id = documentSnapshot.id
      // usersList.push(documentSnapshot.data().name as any) 
      if(user.email === documentSnapshot.data().email){
        userData = {
          id: documentSnapshot.id,
          email: documentSnapshot.data().email,
          name: documentSnapshot.data().name,
          admin: documentSnapshot.data().admin
        }
      }
    });
  })

  return userData
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: ''
  } as MyState,
  reducers: {
    // setUser: (state, action) => {
    //   state.user = action.payload
    // },
    // setUserLoading: (state, action) => {
    //     state.userLoading = action.payload
    // }
  },
  extraReducers: (builder) => {
    builder
    .addCase(setUser.pending, (state, action) => {
      state.status = 'loading'
    })
    .addCase(setUser.fulfilled, (state, { payload }) => {
      state.status = 'succeeded'
      state.user = payload
    })
  }
})

export default authSlice