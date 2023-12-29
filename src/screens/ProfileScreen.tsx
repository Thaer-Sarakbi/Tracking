import React from 'react';
import { Text, View, Image, Dimensions, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Seperator from '../components/Seperator';
import { Colors } from '../assets/Colors';
import { useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { User } from '../types/types';
import moment from 'moment';

const windowHeight = Dimensions.get('window').height;

interface ProfileState {
  auth: {user: User}
}

function ProfileScreen(): JSX.Element {
  const user = useSelector((state: ProfileState) => state.auth.user)

  const onSignOut = async() => {
    await auth().signOut().then(function() {
      console.log('Signed Out');
    }, function(error) {
      console.error('Sign Out Error', error);
    });
  }

    const  feilds = [
      {title: 'Email', value: user?.email},
      {title: 'Mobile Number', value: user?.mobile},
      {title: 'Password', value: '*******'}
    ]

    return (
      <ScrollView style = {{ marginBottom: 10 }}>
        <View>
          <ImageBackground style={{ width: '100%', height: windowHeight / 3, justifyContent: 'center', alignItems: 'center' }} source={require('../assets/profile.jpg')} >
            <View style={{ width: 90, height: 90, borderRadius: 50, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name="account-outline" color={'#BDBDBD'} size={60} />
            </View>
            <Text style = {{ color: '#fff', fontSize: 15, marginTop: 10 }}>{user?.name}</Text>
            <Text style = {{ color: '#fff', fontSize: 15 }}>Joined in {moment(user?.creationDate).format('MMMM YYYY')}</Text>
          </ImageBackground>
          
          <View style = {{ paddingHorizontal: 10, paddingTop: 10 }}>
            <Text style = {{  fontWeight: 'bold', fontSize: 20, color: Colors.titles }}>Profile Details</Text>

            {
              feilds.map((feild, index) => (
                <View key={index}>
                  <Text style = {{ color: Colors.titles, marginTop: 10, fontSize: 15 }}>{feild.title}</Text>
                  <Text style = {{ color: Colors.texts, fontSize: 15 }}>{feild.value}</Text>

                  <Seperator />
                </View>
              ))
            }
            
            <Text style = {{  fontWeight: 'bold', fontSize: 20, color: Colors.titles, marginBottom: 10 }}>Document Provider</Text>
            <View style = {{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style = {{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="arrow-up-circle" color={'#9E9E9E'} size={30} />

                <View style = {{ marginLeft: 15 }}>
                  <Text style = {{ color: Colors.texts }}>To Upload</Text>
                  <Text style = {{ color: Colors.texts }}>Selfie with IC</Text>
                </View>
              </View>
              <View style = {{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="arrow-up-circle" color={'#9E9E9E'} size={30} />

                <View style = {{ marginLeft: 15 }}>
                  <Text style = {{ color: Colors.texts }}>To Upload</Text>
                  <Text style = {{ color: Colors.texts }}>IC/Passport</Text>
                </View>
              </View>
            </View>

            <View style = {{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
              <View style = {{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="arrow-up-circle" color={'#9E9E9E'} size={30} />

                <View style = {{ marginLeft: 15 }}>
                  <Text style = {{ color: Colors.texts }}>To Upload</Text>
                  <Text style = {{ color: Colors.texts }}>Driving License</Text>
                </View>
              </View>
              <View style = {{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="arrow-up-circle" color={'#9E9E9E'} size={30} />

                <View style = {{ marginLeft: 15 }}>
                  <Text style = {{ color: Colors.texts }}>To Upload</Text>
                  <Text style = {{ color: Colors.texts }}></Text>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={() => onSignOut()} style = {{ borderWidth: 1, borderColor: 'red', width: '90%',height: 45 , justifyContent: 'center', alignItems: 'center', marginTop: 15, alignSelf: 'center', borderRadius: 10 }}>
              <Text style = {{ color: 'red', fontWeight: 'bold' }}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
}

export default ProfileScreen;