import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import Login from "./screens/Login"
import TopTabs from "./navigation/TopTabs"
import TaskDetailsScreen from "./screens/TaskDetailsScreen"
import NotificationsScreen from "./screens/NotificationsScreen"
import SignUpScreen from "./screens/SignupScreen"
import UpdateDetailsScreen from "./screens/UpdateDetailsScreen"
import Header from "./components/Header"
import HeaderDetails from "./components/HeaderDetails"

const Stack = createStackNavigator<RootStackParamsList>()

export type RootStackParamsList = {
    TopTabs: undefined,
    DrawerNav: undefined,
    TaskDetails: {
      taskId: string,
      userId: string,
      userName: string
    },
    TasksList: undefined,
    Notifications: undefined,
    Header: undefined,
    HeaderDetails: undefined
    UpdateDetails: undefined
}

const AppStack = () => {
  return(
    <Stack.Navigator>
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
    </Stack.Navigator>
  )
}

export default AppStack