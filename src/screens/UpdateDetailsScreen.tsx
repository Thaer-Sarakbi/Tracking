import React, { useState } from 'react';
import { Image, ImageBackground, Text, View, LogBox } from 'react-native';
import HeaderDetails from '../components/HeaderDetails';
import { StyleSheet } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import { Colors } from '../assets/Colors';
import ImageView from "react-native-image-viewing";
import { RouteProp } from '@react-navigation/native';
import { RootStackParamsList } from '../navigation/AppStack';
import { StackNavigationProp } from '@react-navigation/stack';
import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth';
import { useSelector } from 'react-redux';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  
interface Props {
  route: RouteProp<RootStackParamsList, "UpdateDetails">
  navigation: StackNavigationProp<RootStackParamsList, "UpdateDetails">
}
 

const UpdateDetailsScreen = ({ route, navigation } : Props) => {
  const [isVisible, setIsVisible] = useState(false)
  const [index, setIndex] = useState(0)

  const user = useSelector((state: notificationsState) => state.auth.user)

     
  const images = route.params.update.images?.map((image: string) => {
    console.log(`https://firebasestorage.googleapis.com/v0/b/tracking-6569e.appspot.com/o/${image.path.slice(64)}?alt=media&token=${user.deviceToken}`)
    if(image.path.includes('react-native-image-crop-picker')){
     
      return( 
        `https://firebasestorage.googleapis.com/v0/b/tracking-6569e.appspot.com/o/${image.path.slice(70)}?alt=media&token=${user.deviceToken}`
      )
    } else {
      // console.log(image.path.slice(64))
      return( 
        `https://firebasestorage.googleapis.com/v0/b/tracking-6569e.appspot.com/o/${image.path.slice(64)}?alt=media&token=${user.deviceToken}`
    )
    } 
    // console.log(`https://firebasestorage.googleapis.com/v0/b/tracking-6569e.appspot.com/o/${image.path.slice(64)}?alt=media&token=${user.deviceToken}`)
   
  })
 
  const images2 = route.params.update.images?.map((image : string) => {
    // console.log(image.path)
    return(
        { uri: `https://firebasestorage.googleapis.com/v0/b/tracking-6569e.appspot.com/o/${image.path.slice(70)}?alt=media&token=8884e841-1118-44f8-97c6-3b15b85b417f`}
    )
  }) 

  if(route){
    return (
        <View>
          <HeaderDetails navigation={navigation}/>

          <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
            <Text style={styles.title}>{route.params.update.title}</Text>
            <Text style={styles.decription}>{route.params.update.description}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Updated By: </Text>
              <Text style={{ fontSize: 15 }}> {route.params.update.updatedBy}</Text>
            </View>       
          </View>

          {images && (<SliderBox
            images={images}
            sliderBoxHeight={400}
            firstItem={index}
            onCurrentImagePressed={(index: number) => {
              setIsVisible(true)
              setIndex(index)
            }}
           />)}

          {images && (<ImageView
            images={images2}
            imageIndex={index}
            visible={isVisible}
            onRequestClose={() => setIsVisible(false)}
            onImageIndexChange={(i) => setIndex(i)}
           />)}
        </View>
      );
  } else {
    return(
        <View />
    )
  }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: Colors.titles,
        marginVertical: 20
      },
      decription:{
        fontSize: 15
      },
  })

export default UpdateDetailsScreen;