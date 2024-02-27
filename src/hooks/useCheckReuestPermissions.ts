import { useState } from 'react';
import { Alert, PermissionsAndroid } from 'react-native';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

export default function useCheckReuestPermissions(){
  const [permissionStatus, setPermissionStatus] = useState('')

  const requestNotificationPermission = async () => {
    try{
        const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
                title: "Cool Photo App Camera Permission",
                message:
                  "Cool Photo App needs access to your camera " +
                  "so you can take awesome pictures.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
              }
        )
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the camera");
          } else {
            console.log("Camera permission denied");
          }
    } catch(err) {
        console.warn(err);
    }
    // if (result === RESULTS.GRANTED) {
    //     console.log('Notification permission granted');
    //   } else {
    //     console.log('Notification permission denied');
    //   }
  };
      
  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    console.log(result)

    if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Notification Permission Blocked',
          'Please enable notifications in your device settings to receive updates.',
          [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'Settings', onPress: () => requestNotificationPermission() },
          ]
        );
      } else if (result === RESULTS.DENIED) {
        requestNotificationPermission();
      }
  };


  const requestPermission = async () => {
    const checkPermission = await checkNotificationPermission();
    
    if (checkPermission !== RESULTS.GRANTED) {
     const request = await requestNotificationPermission();
     setPermissionStatus(request)
       if(request !== RESULTS.GRANTED){
            // permission not granted(
                console.log('thaer')
                await requestNotificationPermission()
        } else {
            console.log('notifications permission granted')
        }
    }
  };

  return { requestPermission, permissionStatus, checkNotificationPermission }
}