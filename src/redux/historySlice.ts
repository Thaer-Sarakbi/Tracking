import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { History, historyList } from '../types/types';

export const getHistory = createAsyncThunk("history/getHistory", async (user:{taskId: string, userId: string, admin:boolean}) => {
  let historyList: Array<History> = []

  if(user.admin){
    const usersCollection = await firestore().collection('users')
  
    const usersQuerySnapshot = await usersCollection.get()
    let usersDataWithHistory = []
  
    for(const userDoc of usersQuerySnapshot.docs){
      const userHistoryCollection = userDoc.ref.collection('tasks').doc(user.taskId).collection('history')

      const historyQuerySnapshot = await userHistoryCollection.get()

      const historyData = historyQuerySnapshot.docs.map((historyDoc) => ({
        id: historyDoc.id,
        ...historyDoc.data()
      }))

      if(historyData[0]){
        usersDataWithHistory.push(
          // id: userDoc.id,
          // userData: userDoc.data(),
          ...historyData
        )
      }
      historyList = usersDataWithHistory
    }
  } else {
    await firestore()
    .collection('users')
    .doc(user.userId)
    .collection('tasks')
    .doc(user.taskId)
    .collection('history')
    .orderBy('updateDate', "desc")
    .get()
    .then(querySnapshot => { 
      querySnapshot.docs.forEach(documentSnapshot => {
        historyList.push(documentSnapshot.data() as any) 
      });
    }).catch((error) => {
      console.log(error)
    });
  }

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