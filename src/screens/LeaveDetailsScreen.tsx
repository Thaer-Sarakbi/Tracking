import React, { useState } from 'react';
import { Text, View, LogBox, TouchableOpacity, ScrollView } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import { Colors } from '../assets/Colors';
import ImageView from "react-native-image-viewing";
import { RouteProp } from '@react-navigation/native';
import { RootStackParamsList } from '../navigation/AppStack';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { UserState } from '../types/types';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  
interface Props {
  route: RouteProp<RootStackParamsList, "LeaveDetails">
  navigation: StackNavigationProp<RootStackParamsList, "LeaveDetails">
}

const LeaveDetailsScreen = ({ route, navigation } : Props) => {
  const [isVisible, setIsVisible] = useState(false)
  const [index, setIndex] = useState(0)

  const user = useSelector((state: UserState) => state.auth.user)

  const reason = route.params.reason
  // const creationDate = route.params.time.toString().replace(/(\r\n|\n|\r)/gm, ",  ")
  const images = route.params.images

  const images1 = images?.map((image: string) => {
    return( 
      `https://firebasestorage.googleapis.com/v0/b/tracking-6569e.appspot.com/o/${image?.substring(image.lastIndexOf('/') + 1)}?alt=media&token=${user.deviceToken}`
    )
  })
  
  const images2 = images?.map((image : string) => {
    return(
        { uri: `https://firebasestorage.googleapis.com/v0/b/tracking-6569e.appspot.com/o/${image?.substring(image.lastIndexOf('/') + 1)}?alt=media&token=${user.deviceToken}`}
    )
  }) 
 
  if(route){
    return (
        <ScrollView style={{ flex: 1, marginBottom: 60 }}>
          <View style={{ backgroundColor: Colors.main, width: '100%', height: 50, justifyContent: 'space-between', paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-outline" size={35} color={'white'} />
            </TouchableOpacity>
          </View>

          <Text style={{ margin: 10, fontSize: 20 }}>{reason}</Text>

          {images && (<SliderBox
            images={images1}
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
        </ScrollView>
      );
  } else {
    return(
      <>
        <LottieView source={require("../assets/loading2.json")} style={{flex: 1}} autoPlay loop />
      </>
    )
  }
}

export default LeaveDetailsScreen;