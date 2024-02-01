import { createStackNavigator } from "@react-navigation/stack"
import React, { useEffect } from "react"
import TopTabs from "./TopTabs"
import TaskDetailsScreen from "../screens/TaskDetailsScreen"
import NotificationsScreen from "../screens/NotificationsScreen"
import UpdateDetailsScreen from "../screens/UpdateDetailsScreen"
import Header from "../components/Header"
import HeaderDetails from "../components/HeaderDetails"
import { Notification, Updates, User } from "../types/types"
import TasksListScreen from "../screens/TasksListScreen"
import BottomNavigator from "./BottomNavigator"
import UpdatesListScreen from "../screens/UpdatesListScreen"
import usePushNotification from "../hooks/usePushNotification"
import { useSelector } from "react-redux"
import SearchBox from "../components/SearchBox"
import SearchScreen from "../screens/SearchScreen"

const Stack = createStackNavigator<RootStackParamsList>()

interface MyState {
  auth: {user: User}
}

export type RootStackParamsList = {
    BottomNavigator: undefined,
    TasksList: undefined
    TaskDetails: {
      taskId: string,
      // userId: string,
      // userName: string,
      status: string,
      creationDate: {
        seconds: number
      },
      title: string,
      description: string,
      duration: number,
      assigenId: string
      assignedTo: string,
      latitude: number,
      longitude: number,
      deviceToken: string
    },
    Notifications: undefined,
    // Header: {
    //   notifications: Array<Notification>
    // },
    HeaderDetails: {
      taskId: string, 
      assigenId: string, 
      userId: string, 
      admin: boolean
    },
    UpdateDetails: Updates,
    UpdatesList:{
      updatesList: Array<Updates>
      date: string
    }
}

const AppStack = () => {
  const user = useSelector((state: MyState) => state.auth.user)

  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  const listenToNotifications = () => {
    try {
      getFCMToken(user);
      requestUserPermission();
      onNotificationOpenedAppFromQuit();
      listenToBackgroundNotifications();
      listenToForegroundNotifications();
      onNotificationOpenedAppFromBackground();
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    listenToNotifications();
  },[user])

  return(
    <Stack.Navigator>
        <Stack.Screen
          name="BottomNavigator"
          component={BottomNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TasksList"
          component={TasksListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetailsScreen}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="Header"
          component={Header}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="HeaderDetails"
          component={HeaderDetails}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdateDetails"
          component={UpdateDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdatesList"
          component={UpdatesListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
    </Stack.Navigator>
  )
}

export default AppStack