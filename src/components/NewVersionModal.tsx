import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import AppLink from 'react-native-app-link';
import { Colors } from '../assets/Colors';

interface Props {
  changeModalVisible: (boole: boolean) => void,
  isModalVisible: boolean,
}

const NewVersionModal = ({ changeModalVisible, isModalVisible } : Props) => {

   const containerStyle = {
     ...styles.container,
     ...isModalVisible ? { backgroundColor: 'rgba(0, 0, 0, 0.5)' } : ''
   }

   const gotoStore = () =>{
    AppLink.openInStore({ appName:'Tracking', appStoreId:  978, appStoreLocale: '', playStoreId:'com.ark.tracking' }).then(() => {

    })
    .catch((err) => {

    });
  }

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={() => changeModalVisible(false)}
      >
        <View style={styles.modal}>
            <Text style={{ fontSize: 20, marginTop: 20, textAlign: 'center' }}>New Update Available {"\n"} Click To Update</Text>
            <TouchableOpacity style={styles.close} onPress={() => gotoStore()}>
              <Text style={{ color: 'white', fontSize: 20 }}>Update</Text>
            </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        width: '75%',
        height: 200,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        padding: 10
    },
    close: {
        backgroundColor: Colors.main,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderRadius: 10
    }
})

export default NewVersionModal