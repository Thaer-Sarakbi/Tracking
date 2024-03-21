import Geolocation from '@react-native-community/geolocation';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

export default function useGetLocation(){
    const [latitude, setLatitude] = useState<number>(); 
    const [longitude, setLongitude] = useState<number>(); 

    const checkIsLocationEnabled = async() => {
      if (Platform.OS === 'android') {
        try {
          const enableResult = await promptForEnableLocationIfNeeded();
          console.log('location ' + enableResult)
          if(enableResult === 'enabled'){
    
          }
        } catch (error: unknown) {
            console.log('error')
        }
      }
    }
    Geolocation.getCurrentPosition((info: {coords:{latitude: number, longitude: number}}) => {
      setLatitude(info.coords.latitude)
      setLongitude(info.coords.longitude)
    },(err: string) => {
      // enableLocation()

    },{
    
  })
    
    useEffect(() => {

    },[])


    return {latitude, longitude, checkIsLocationEnabled}
}