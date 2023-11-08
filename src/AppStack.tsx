import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import Login from "./screens/Login"
import TopTabs from "./navigation/TopTabs"

const Stack = createStackNavigator<RootStackParamsList>()

export type RootStackParamsList = {
    Login: undefined,
    TopTabs: undefined
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
    </Stack.Navigator>
  )
}

export default AppStack