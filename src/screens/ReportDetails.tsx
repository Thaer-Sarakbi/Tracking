import React, { useEffect } from 'react';
import { Text, View, LogBox, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../assets/Colors';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamsList } from '../navigation/AppStack';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { DocFile, UserState } from '../types/types';
import ImagesSlider from '../components/ImagesSlider';
import useUploadImages from '../hooks/useUploadImages';
import useUploadDocument from '../hooks/useUploadDocument';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  
interface Props {
  route: RouteProp<RootStackParamsList, "ReportDetails">
  navigation: StackNavigationProp<RootStackParamsList, "ReportDetails">
}

const ReportDetailsScreen = ({ route, navigation } : Props) => {

  const { downloadPdf } = useUploadImages()
  const { downloadFile } = useUploadDocument()
  const user = useSelector((state: UserState) => state.auth.user)

  const dailyReport = route.params.dailyReport
  const images = route.params.images
  const files = route.params.files
  const name = route.params.name

  if(route){
    return (
        <ScrollView style={{ flex: 1, marginBottom: 60 }}>
          <View style={{ backgroundColor: Colors.main, width: '100%', height: 50, justifyContent: 'space-between', paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-outline" size={35} color={'white'} />
            </TouchableOpacity>
          </View>

          <Text style={{ margin: 10, fontSize: 20 }}>{dailyReport}</Text>

          {images && <ImagesSlider images={images} user={user} />}

          {images.length > 0 && (<TouchableOpacity onPress={() => downloadPdf(name)} style={{ width: '90%', height: 50, backgroundColor: Colors.main, alignSelf: 'center', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
            <Icon name="download-outline" size={27} color={'white'} />
            <Text style={{ fontSize: 20, color: 'white', marginLeft: 5 }}>Download</Text>
          </TouchableOpacity>)}

          {files?.length > 0 && <Text style={{ fontSize: 20, marginLeft: 10, fontWeight: 'bold', marginTop: 10 }}>Files:</Text>}
          {files?.length > 0 && files.map((file: DocFile, i: number) => {
            return(
              <View key={i} style={{ backgroundColor: 'white', marginHorizontal: 10, padding: 10, borderRadius: 10, marginTop: 10 }}>
                <Text style={{ marginVertical: 5 }}>{file.name}</Text>
                <TouchableOpacity onPress={() => downloadFile(file.name)} style={{ width: '90%', height: 50, backgroundColor: Colors.main, alignSelf: 'center', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                  <Icon name="download-outline" size={27} color={'white'} />
                  <Text style={{ fontSize: 20, color: 'white', marginLeft: 5 }}>Download</Text>
                </TouchableOpacity>
              </View>
            )
          })}
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

export default ReportDetailsScreen;