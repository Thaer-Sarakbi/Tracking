import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import BottomTab from "./navigation/BottomTab"
import Login from "./screens/Login"

const Stack = createStackNavigator<RootStackParamsList>()

export type RootStackParamsList = {
    Login: undefined,
    BottomTab: undefined
}

const AppStack = () => {
  return(
    <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{ headerShown: false }}
        />
    </Stack.Navigator>
  )
}

export default AppStack