import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import Header from "../components/Header"
import SearchBox from "../components/SearchBox"

const Stack = createStackNavigator()

// export type AuthStackParamsList = {
//     Header: undefined,
//   Signup: undefined
// }

const HeaderStack = () => {
    return(
      <Stack.Navigator>
         
          <Stack.Screen
            name="SearchBox"
            component={SearchBox}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="Header"
            component={Header}
            options={{ headerShown: false }}
          />
      </Stack.Navigator>
    )
  }
  
  export default HeaderStack