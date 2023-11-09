import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TopTabs from './TopTabs';
import ProfileScreen from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNav() {

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Main" component={TopTabs} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}