import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import Login from "./screens/Login"
import TopTabs from "./navigation/TopTabs"
import DrawerNav from "./navigation/DrawerNav"
import TaskDetailsScreen from "./screens/TaskDetailsScreen"
import NotificationsScreen from "./screens/NotificationsScreen"
import Header from "./components/Header"

const Stack = createStackNavigator<RootStackParamsList>()

export type RootStackParamsList = {
    Login: undefined,
    TopTabs: undefined,
    DrawerNav: undefined,
    TaskDetails: {
      taskId: string
    },
    TasksList: undefined,
    Notifications: undefined,
    Header: undefined
}

const AppStack = () => {
  return(
    <Stack.Navigator>
        {/* <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        /> */}
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
        {/* <Stack.Screen
          name="Header"
          component={Header}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="TasksList"
          component={TasksListScreen}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="Card"
          component={Card}
          options={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="DrawerNav"
          component={DrawerNav}
          // options={{ headerShown: false }}
        /> */}
    </Stack.Navigator>
  )
}

export default AppStack