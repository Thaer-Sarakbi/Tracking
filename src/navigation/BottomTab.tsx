import * as React from 'react';
// import Icon from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TasksListScreen from '../screens/TasksListScreen';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator >
      <Tab.Screen 
        options={{ 
          headerShown: false, 
          tabBarLabelStyle: { display: 'none'},
        //   tabBarIcon: ({ focused }) => (
        //      <Icon name="home-outline" size={30} color={focused ? "#4F8EF7" : "#919191"} />
        //   )
        }} 
        name="TasksList" 
        component={TasksListScreen} 
      />
    </Tab.Navigator>
  );
}