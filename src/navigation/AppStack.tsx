import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import TopTabs from "./TopTabs"
import TaskDetailsScreen from "../screens/TaskDetailsScreen"
import NotificationsScreen from "../screens/NotificationsScreen"
import UpdateDetailsScreen from "../screens/UpdateDetailsScreen"
import Header from "../components/Header"
import HeaderDetails from "../components/HeaderDetails"
import { Updates } from "../types/types"
import TasksListScreen from "../screens/TasksListScreen"
import BottomNavigator from "./BottomNavigator"
import UpdatesListScreen from "../screens/UpdatesListScreen"

const Stack = createStackNavigator<RootStackParamsList>()

export type RootStackParamsList = {
    BottomNavigator: undefined,
    TasksList: undefined
    TaskDetails: {
      taskId: string,
      userId: string,
      userName: string,
      status: string,
      creationDate: string
    },
    Notifications: undefined,
    Header: undefined,
    HeaderDetails: undefined
    UpdateDetails: {
      update: Updates
    }
}

const AppStack = () => {
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
        <Stack.Screen
          name="Header"
          component={Header}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HeaderDetails"
          component={HeaderDetails}
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
    </Stack.Navigator>
  )
}

export default AppStack