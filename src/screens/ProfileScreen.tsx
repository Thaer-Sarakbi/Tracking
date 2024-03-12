import React from 'react';
import { Text, View, Dimensions, ImageBackground, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Seperator from '../components/Seperator';
import { Colors } from '../assets/Colors';
import { useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { User } from '../types/types';
import moment from 'moment';
import packageJson from '../../package.json';
import useShowPassword from '../hooks/useShowPassword';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const windowHeight = Dimensions.get('window').height;

interface ProfileState {
  auth: {user: User}
}

function ProfileScreen(): JSX.Element {
  const user = useSelector((state: ProfileState) => state.auth.user)

  const { showPassword, toggleShowPassword } = useShowPassword() 

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
      {title: 'Password', value: showPassword ? user?.password : '*******'}
    ]

    return (
      <ScrollView style = {styles.container}>
        <View>
          <ImageBackground style={styles.background} source={require('../assets/profile.jpg')} >
            <View style={styles.container}>
              <MaterialCommunityIcons name="account-outline" color={'#BDBDBD'} size={60} />
            </View>
            <Text style = {styles.name}>{user?.name}</Text>
            <Text style = {styles.joined}>Joined in {moment(user?.creationDate).format('MMMM YYYY')}</Text>
          </ImageBackground>
          
          <View style = {styles.body}>
            <Text style = {styles.mainTitle}>Profile Details</Text>

            {
              feilds.map((feild, index) => (
                <View key={index}>
                  <Text style = {styles.title}>{feild.title}</Text>
                  <Text style = {styles.value}>{feild.value}</Text>

                  {feild.title === 'Password' && (<MaterialIcons 
                    name={showPassword ? 'visibility-off' : 'visibility'} 
                    size={25} 
                    color="#aaa"
                    style={{marginRight: 10}} 
                    onPress={toggleShowPassword} 
                  />)} 
                  <Seperator />
                </View>
              ))
            }
            
            <Text style = {{  fontWeight: 'bold', fontSize: 20, color: Colors.titles, marginBottom: 10 }}>Document Provider</Text>
            <View style = {{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style = {{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="arrow-up-circle" color={'#9E9E9E'} size={30} />

                <View style = {{ marginLeft: 15 }}>
                  <Text style = {styles.docs}>To Upload</Text>
                  <Text style = {styles.docs}>Selfie with IC</Text>
                </View>
              </View>
              <View style = {{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="arrow-up-circle" color={'#9E9E9E'} size={30} />

                <View style = {{ marginLeft: 15 }}>
                  <Text style = {styles.docs}>To Upload</Text>
                  <Text style = {styles.docs}>IC/Passport</Text>
                </View>
              </View>
            </View>

            <View style = {{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
              <View style = {{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="arrow-up-circle" color={'#9E9E9E'} size={30} />

                <View style = {{ marginLeft: 15 }}>
                  <Text style = {styles.docs}>To Upload</Text>
                  <Text style = {styles.docs}>Driving License</Text>
                </View>
              </View>
              <View style = {{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="arrow-up-circle" color={'#9E9E9E'} size={30} />

                <View style = {{ marginLeft: 15 }}>
                  <Text style = {styles.docs}>To Upload</Text>
                  <Text style = {styles.docs}></Text>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={() => onSignOut()} style = {styles.logOutButton}>
              <Text style = {styles.logOutText}>Log Out</Text>
            </TouchableOpacity>

            <Text style={styles.version}>version: {packageJson.version}</Text>
          </View>
        </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: { 
    marginBottom: 10 
  },
  background: { 
    width: '100%', 
    height: windowHeight / 3, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  iconContainer: { 
    width: 90, 
    height: 90, 
    borderRadius: 50, 
    backgroundColor: '#F5F5F5', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  name: { 
    color: '#fff', 
    fontSize: 15, 
    marginTop: 10 
  },
  joined: { 
    color: '#fff', 
    fontSize: 15 
  },
  body: { 
    paddingHorizontal: 10, 
    paddingTop: 10 
  },
  mainTitle: {  
    fontWeight: 'bold', 
    fontSize: 20, 
    color: Colors.titles 
  },
  title: { 
    color: Colors.titles, 
    marginTop: 10, 
    fontSize: 15 
  },
  value: { 
    color: Colors.texts, 
    fontSize: 15 
  },
  docs: { 
    color: Colors.texts 
  },
  logOutText: { 
    color: 'red', 
    fontWeight: 'bold' 
  },
  logOutButton: { 
    borderWidth: 1, 
    borderColor: 'red', 
    width: '90%',
    height: 45 , 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 15, 
    alignSelf: 'center', 
    borderRadius: 10 
  },
  version: { 
    alignSelf: 'center', 
    fontSize: 15, 
    marginVertical: 10 
  }
});


export default ProfileScreen;