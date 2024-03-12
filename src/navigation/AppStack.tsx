import { createStackNavigator } from "@react-navigation/stack"
import React, { useEffect } from "react"
import TaskDetailsScreen from "../screens/TaskDetailsScreen"
import NotificationsScreen from "../screens/NotificationsScreen"
import UpdateDetailsScreen from "../screens/UpdateDetailsScreen"
import { Task, Updates, User, UserState, dailyReport, leaveReport, tasks } from "../types/types"
import BottomNavigator from "./BottomNavigator"
import UpdatesListScreen from "../screens/UpdatesListScreen"
import usePushNotification from "../hooks/usePushNotification"
import { useSelector } from "react-redux"
import SearchScreen from "../screens/SearchScreen"
import ReportDetailsScreen from "../screens/ReportDetails"
import AttendanceDetailsScreen from "../screens/AttendanceDetailsScreen"
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import LeaveDetailsScreen from "../screens/LeaveDetailsScreen"
import ChatListScreen from "../screens/ChatListScreen"
import TopTabs from "./TopTabs"
 
const Stack = createStackNavigator<RootStackParamsList>()

export type RootStackParamsList = {
    BottomNavigator: undefined,
    TasksList: {
      navigation: undefined, 
      user: User, 
      tasks: tasks[]
    },
    TaskDetails: {
      id: string,
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
      location: string,
      deviceToken: string | undefined
    },
    Notifications: undefined,
    HeaderDetails: {
      taskId: string, 
      assigenId: string, 
      userId: string, 
      admin: boolean
    },
    UpdateDetails: Updates,
    UpdatesList:{
      updatesList: Array<Updates>,
      dailyReport: dailyReport,
      leaveReport: leaveReport,
      date: string,
      selected: string
    },
    ReportDetails:{
        dailyReport: string, 
        id: string, 
        images: Array<string>, 
        time: string
    },
    LeaveDetails:{
      reason: string,
      images: string[] 
    },
    AttendanceDetails:{
      checkIn: {
        time: Date,
        latitude: number,
        longitude: number,
        note: string
      },
      checkOut: {
        time: Date,
        latitude: number,
        longitude: number,
        note: string
      }
    },
    ChatList: undefined,
    TopTabs: {
      navigation: undefined
    },
    Search:{
      user: User,
      tasks: Task[]
    }
}

const AppStack = () => {
  const user = useSelector((state: UserState) => state.auth.user)
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

  const DisplayNotification = async (message: any) => {
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
          name="TopTabs"
          component={TopTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetailsScreen}
          options={{ headerShown: false }}
        />
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
        <Stack.Screen
          name="ChatList"
          component={ChatListScreen}
          options={{ headerShown: false }}
        />
    </Stack.Navigator>
  )
}

export default AppStack