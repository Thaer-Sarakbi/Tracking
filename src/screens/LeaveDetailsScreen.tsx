import React from 'react';
import { Text, View, LogBox, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../assets/Colors';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamsList } from '../navigation/AppStack';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { UserState } from '../types/types';
import ImagesSlider from '../components/ImagesSlider';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  
interface Props {
  route: RouteProp<RootStackParamsList, "LeaveDetails">
  navigation: StackNavigationProp<RootStackParamsList, "LeaveDetails">
}

const LeaveDetailsScreen = ({ route, navigation } : Props) => {

  const user = useSelector((state: UserState) => state.auth.user)

  const reason = route.params.reason
  const images = route.params.images
 
  if(route){
    return (
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-outline" size={35} color={'white'} />
            </TouchableOpacity>
          </View>

          <Text style={styles.text}>{reason}</Text>

          {images && <ImagesSlider images={images} user={user} />}
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

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    marginBottom: 60 
  },
  header: { 
    backgroundColor: Colors.main, 
    width: '100%', 
    height: 50, 
    justifyContent: 'space-between', 
    paddingLeft: 10, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  text:{ 
    margin: 10, 
    fontSize: 20 
  }
});

export default LeaveDetailsScreen;