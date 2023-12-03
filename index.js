/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";
import { navigate } from './src/navigation/RootNavigation';
import messaging from '@react-native-firebase/messaging';

PushNotification.configure({
    onRegister: function (token) {
        console.log("TOKEN:", token);
    },
    // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
        console.log('LOCAL NOTIFICATION ==>', notification)
        const { data } = notification;
        console.log({...notification})
        navigate(notification.data.screen, { ...notification.data });
    },

    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },
    requestPermissions: true,

    popInitialNotification: true,
})

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('State Notification ', remoteMessage)
})

AppRegistry.registerComponent(appName, () => App);