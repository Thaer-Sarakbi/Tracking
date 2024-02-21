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
import ReportDetailsScreen from "../screens/ReportDetails"
import AttendanceDetailsScreen from "../screens/AttendanceDetailsScreen"
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import LeaveDetailsScreen from "../screens/LeaveDetailsScreen"
 
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
      assignedBy: string,
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
  console.log(user)

  const {
    requestUserPermission,
    getFCMToken,
    // listenToBackgroundNotifications,
    // listenToForegroundNotifications,
    // onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  const listenToNotifications = () => {
    try {
      getFCMToken(user);
      requestUserPermission();
      onNotificationOpenedAppFromQuit();
      // listenToBackgroundNotifications();
      // listenToForegroundNotifications();
      // onNotificationOpenedAppFromBackground();
    } catch (error) {
      console.log(error);
    }
  };

  const DisplayNotification = async (message) => {
    console.log('id ', JSON.stringify(message.data.channelId))
    //console.log('notification ', JSON.stringify(message.notification))
    // Create a channel
    const channelId = await notifee.createChannel({
      id: message.data.id,
      name: message.data.channelName,
      vibration: true,
      //vibrationPattern: [300, 500],
    });

    console.log('channelId'  + JSON.stringify(channelId))
    console.log('thaer2')
    // Display a notification
   await notifee.displayNotification({
      title: message.notification.title,
      body: message.notification.body,
      data: message.data,
      android:{
        channelId
      }
    });
  }

  useEffect(() => {
    listenToNotifications();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'A new message arrived! (FOREGROUND)',
        JSON.stringify(remoteMessage),
      );
    
    DisplayNotification(remoteMessage);
    });

    const unsubscribeBackground = messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log(
        'A new message arrived! (BACKGROUND)',
        JSON.stringify(remoteMessage),
      );

      DisplayNotification(remoteMessage);

    notifee.onBackgroundEvent(async({type, detail}) => {
        switch(type){
          case EventType.PRESS:
            console.log('User pressed notification', detail.notification)
            break;
          case EventType.DISMISSED:
            console.log('User dismissed notification', detail.notification);
        }
      })
    });
    
    // const backgroundeventListener =  notifee.onBackgroundEvent(async({type, detail}) => {
    //   console.log('huigi')
    //   switch(type){
    //     case EventType.PRESS:
    //       console.log('User pressed notification', detail.notification)
    //       break;
    //     case EventType.DISMISSED:
    //       console.log('User dismissed notification', detail.notification);
    //   }
    // })

    return () => {
      unsubscribe()
      unsubscribeBackground
      // backgroundeventListener
      listenToNotifications()
      // backgroundeventListener
    };
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
        <Stack.Screen
          name="ReportDetails"
          component={ReportDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LeaveDetails"
          component={LeaveDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AttendanceDetails"
          component={AttendanceDetailsScreen}
          options={{ headerShown: false }}
        />
    </Stack.Navigator>
  )
}

export default AppStack