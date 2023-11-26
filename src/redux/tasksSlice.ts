import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { Task, tasks, TasksState } from '../types/types';
import moment from 'moment';

export const updateTask = createAsyncThunk("tasks/updateTask", async (task: { id: string, status: string, userId: string}) => {

  await firestore()
  .collection('users')
  .doc(task.userId)
  .collection('tasks')
  .doc(task.id)
  .update({
    status: task.status
  })
  .then(() => {
    console.log('updated')
    firestore().collection('users').doc(task.userId).collection('tasks').doc(task.id).collection('history').add({
    status: task.status,
    updatDate: moment().format('MMM Do YYYY, hh:mm a')
    }).then(() => {
      console.log('history created')
    })
  });
})

export const getTasks = createAsyncThunk("tasks/getTasks", async (userId) => {
  console.log('userId' + userId)
  let tasksList: Array<Task> = []

  await firestore().collection('users').doc(userId).collection('tasks').get()
  .then(querySnapshot => { 
    // console.log(querySnapshot)
    querySnapshot.docs.forEach(documentSnapshot => {
      documentSnapshot.data().id = documentSnapshot.id
      tasksList.push(documentSnapshot.data() as any) 
    });
  }).catch((error) => {
    console.log(error)
  });

  return tasksList
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    data: [],
    // task: undefined,
    status: '',
    error: undefined
  } as tasks,
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
        console.log(action)
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export default tasksSlice