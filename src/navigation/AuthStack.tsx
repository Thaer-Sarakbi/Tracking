import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import Login from "../screens/Login"
import SignUpScreen from "../screens/SignupScreen"

const Stack = createStackNavigator<AuthStackParamsList>()

export type AuthStackParamsList = {
  Login: undefined,
  Signup: undefined
}

const AuthStack = () => {
    return(
      <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
      </Stack.Navigator>
    )
  }
  
  export default AuthStack