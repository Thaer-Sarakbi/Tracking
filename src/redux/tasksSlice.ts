import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { Task, tasks, TasksState } from '../types/types';

// interface MyState {
//   data: Array<Task>
//   task: Task,
//   status: string,
//   error: string | undefined
// }

export const getTasks = createAsyncThunk("tasks/getTasks", async () => {
  let tasksList: Array<Task> = []

  await firestore().collection('users').doc('ArBP1hNGf2ScyBjdiDfE').collection('tasks').get()
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

export const getTask = createAsyncThunk("tasks/getTask", async (id: string) => {

  const taskDetails = await firestore().collection('users').doc('ArBP1hNGf2ScyBjdiDfE').collection('tasks').doc(id).get()
  .then(querySnapshot => { 
    return querySnapshot.data()
  });

  return taskDetails
})
// export const addTask = createAsyncThunk("tasks/addTask", async (title, decription, assignTo, duration, location) => {
//   console.log('hekl')
//   await firestore().collection('users').doc('ArBP1hNGf2ScyBjdiDfE').collection('tasks').add({
//     title, 
//     decription, 
//     assignTo, 
//     duration, 
//     location
//   }).then(res => {
//     // changeModalVisible(false)
//     console.log(res)
//   }).catch(err => {
//     // changeModalVisible(false)
//     console.log(err)
//   })
// })

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    data: [],
    task: '',
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
      .addCase(getTask.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getTask.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.task = payload
      })
      .addCase(getTask.rejected, (state, action) => {
        console.log(action)
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export default tasksSlice