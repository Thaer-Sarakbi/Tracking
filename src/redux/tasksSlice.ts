import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { Task, tasks, TasksState } from '../types/types';

export const updateTask = createAsyncThunk("tasks/updateTask", async (task: { id: string, status: string, userId: string, updaterName: string}) => {
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
    updateDate: new Date(),
    updatedBy: task.updaterName
    }).then(() => {
      console.log('history created')
    })
  }).catch((e) => {
    console.log(e)
  });
})

export const getTasks = createAsyncThunk("tasks/getTasks", async (user:{id: string, admin: boolean}) => {
  let tasksList: Array<Task> = []

  if(user.admin){
    const usersCollection = await firestore().collection('users')

    const usersQuerySnapshot = await usersCollection.get()
    let usersDataWithTasks = []
  
    for(const userDoc of usersQuerySnapshot.docs){
      const userTasksCollection = userDoc.ref.collection('tasks')
  
      const tasksQuerySnapshot = await userTasksCollection.get()
  
      const tasksData = tasksQuerySnapshot.docs.map((taskDoc) => ({
        id: taskDoc.id,
        ...taskDoc.data()
      }))
  
      if(tasksData[0]){
        usersDataWithTasks.push(
          // id: userDoc.id,
          // userData: userDoc.data(),
          ...tasksData
        )
      }
      tasksList = usersDataWithTasks
    }
  } else {
    await firestore()
    .collection('users')
    .doc(user.id)
    .collection('tasks')
    .orderBy('creationDate', "desc")
    .get()
.then(querySnapshot => { 
querySnapshot.docs.forEach(documentSnapshot => {
  console.log(documentSnapshot.data())
  documentSnapshot.data().id = documentSnapshot.id
  tasksList.push(documentSnapshot.data() as any) 
});
}).catch((error) => {
console.log(error)
});
  }

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