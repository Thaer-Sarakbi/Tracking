import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore, { firebase } from '@react-native-firebase/firestore'
import { Task } from '../types/types';

interface MyState {
  data: Array<Task>
  status: string,
  error: string | undefined
}

export const getTasks = createAsyncThunk("tasks/getTasks", async () => {
  let tasksList: Array<Task> = []
  const user = firebase.auth().currentUser;

if (user) {
 console.log('User email: ', user);
}

  await firestore().collection('users').doc('ArBP1hNGf2ScyBjdiDfE').collection('tasks').get()
  .then(querySnapshot => { 
    querySnapshot.docs.forEach(documentSnapshot => {
      documentSnapshot.data().id = documentSnapshot.id
      tasksList.push(documentSnapshot.data() as any) 
    });
  });

  return tasksList
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    data: [],
    status: '',
    error: ''
  } as MyState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getTasks.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.data = payload
      })
      .addCase(getTasks.rejected, (state, action) => {
        console.log(action.error.message)
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export default tasksSlice