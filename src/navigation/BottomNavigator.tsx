import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import TopTabs from './TopTabs';
import CalendarScreen from '../screens/CalenadarScreen';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        options={{ 
            headerShown: false, 
            tabBarLabelStyle: { display: 'none'},
            tabBarIcon: ({ focused }) => (
               <Icon name="home-outline" size={30} color={focused ? "#4F8EF7" : "#919191"} />
            )
        }} 
        component={TopTabs} 
      />
      <Tab.Screen 
        name="Calendar" 
        options={{ 
            headerShown: false, 
            tabBarLabelStyle: { display: 'none'},
            tabBarIcon: ({ focused, color, size }) => (
               <Icon name="calendar-outline" size={30} color={focused ? "#4F8EF7" : "#919191"} />
            )
        }}
        component={CalendarScreen} 
      />
      <Tab.Screen 
        name="Profile" 
        options={{ 
            headerShown: false, 
            tabBarLabelStyle: { display: 'none'},
            tabBarIcon: ({ focused, color, size }) => (
               <Icon name="person-outline" size={30} color={focused ? "#4F8EF7" : "#919191"} />
            )
        }}
        component={ProfileScreen} 
      />
    </Tab.Navigator>
  );
}

export default BottomNavigator