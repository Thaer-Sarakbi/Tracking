import Geolocation from '@react-native-community/geolocation';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

export default function useGetPosition(){
    const [latitude, setLatitude] = useState(); 
    const [longitude, setLongitude] = useState(); 
    const [enabled, setEnabled] = useState(); 
    console.log(latitude)

    const enableLocation = async() => {
        if (Platform.OS === 'android') {
            try {
              const enableResult = await promptForEnableLocationIfNeeded();
              if(enableResult === 'enabled'){
                console.log('enabled')
                setEnabled(true)
              }
            } catch (error: unknown) {
              console.log('error')
            }
          }
    }

    useEffect(() => {
        Geolocation.getCurrentPosition(info => {
            setLatitude(info.coords.latitude)
            setLongitude(info.coords.longitude)
    
          },(err) => {
            enableLocation()
    
          })
    },[enabled])


    return {latitude, longitude, enableLocation}
}