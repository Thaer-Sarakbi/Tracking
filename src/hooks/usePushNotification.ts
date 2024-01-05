import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import { navigate } from '../navigation/RootNavigation';
import notifee from '@notifee/react-native';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore'

const usePushNotification = () => {

  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      //Request iOS permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } else if (Platform.OS === 'android') {
      //Request Android permission (For API level 33+, for 32 or below is not required)
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  }

  const getFCMToken = async (user) => {
    await messaging().registerDeviceForRemoteMessages();

    const fcmToken = await messaging().getToken();
      await firestore()
            .collection('users')
            .doc(user?.id)
            .update({
              deviceToken: fcmToken
            })
            .then(() => {
              console.log('token updated')
            }).catch((e) => {
              console.log(e)
            });
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  const listenToForegroundNotifications = async () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'A new message arrived! (FOREGROUND)',
        JSON.stringify(remoteMessage),
      );
    // navigate(remoteMessage.data.screen, { ...remoteMessage.data })
    DisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }

  const listenToBackgroundNotifications = async () => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        console.log(
          'A new message arrived! (BACKGROUND)',
          JSON.stringify(remoteMessage),
        );
        DisplayNotification(remoteMessage);
      },
    );
    return unsubscribe;
  }

  const onNotificationOpenedAppFromBackground = async () => {
    const unsubscribe = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        console.log(
          'App opened from BACKGROUND by tapping notification:',
          JSON.stringify(remoteMessage),
        );
        navigate(remoteMessage.data.screen, { ...remoteMessage.data })
      },
      // navigate(remoteMessage.data.screen, { ...remoteMessage.data })
    );
    return unsubscribe;
  };

  const onNotificationOpenedAppFromQuit = async () => {
    const message = await messaging().getInitialNotification();

    if(message) {
      console.log('App opened from QUIT by tapping notification:', JSON.stringify(message));
    }
  };
 
  const DisplayNotification = async (message) => {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: message.data.channelId,
      name: message.data.channelName,
      vibration: true,
      vibrationPattern: [300, 500],
    });

    // Display a notification
   await notifee.displayNotification({
      title: message.notification.title,
      body: message.notification.body,
      data: message.data,
      android:{
        channelId
      }
    });
  }

  // const localDisplayNotification =async () => {
  //   // Create a channel
  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //   });

  //   // Display a notification
  //   notifee.displayNotification({
  //     title:
  //       '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
  //     subtitle: '&#129395;',
  //     body: 'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
  //     android: {
  //       channelId,
  //       color: '#4caf50',
  //       actions: [
  //         {
  //           title: '<b>Dance</b> &#128111;',
  //           pressAction: {id: 'dance'},
  //         },
  //         {
  //           title: '<p style="color: #f44336;"><b>Cry</b> &#128557;</p>',
  //           pressAction: {id: 'cry'},
  //         },
  //       ],
  //     },
  //   });
  // }

  return {
    requestUserPermission,
    getFCMToken,
    listenToForegroundNotifications,
    listenToBackgroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  };
};

export default usePushNotification;