import * as React from 'react';
// import Icon from 'react-native-vector-icons/Ionicons';
import TasksListScreen from '../screens/TasksListScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Header from '../components/Header';

const Tab = createMaterialTopTabNavigator();

export default function TopTabs() {
  return (
    <>
      <Header />
      <Tab.Navigator >
        <Tab.Screen 
          options={{ 
            // headerShown: false, 
            // tabBarLabelStyle: { display: 'none'},
          //   tabBarIcon: ({ focused }) => (
          //      <Icon name="home-outline" size={30} color={focused ? "#4F8EF7" : "#919191"} />
          //   )
          }} 
          name="Open" 
          component={TasksListScreen} 
        />
        <Tab.Screen 
          options={{ 
            // headerShown: false, 
            // tabBarLabelStyle: { display: 'none'},
          //   tabBarIcon: ({ focused }) => (
          //      <Icon name="home-outline" size={30} color={focused ? "#4F8EF7" : "#919191"} />
          //   )
          }} 
          name="Completed" 
          component={TasksListScreen} 
        />
      </Tab.Navigator>
    </>
  );
}