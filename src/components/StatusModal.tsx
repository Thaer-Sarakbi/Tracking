import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  changeModalVisible: (boole: boolean) => void,
  isModalVisible: boolean,
  setData: (data: string) => void
}

const StatusModal = ({ changeModalVisible, isModalVisible, setData } : Props) => {

   const closeModal = (bool: boolean, data: string) => {
     changeModalVisible(bool)
     setData(data)
   }

   const containerStyle = {
     ...styles.container,
     ...isModalVisible ? { backgroundColor: 'rgba(0, 0, 0, 0.5)' } : ''
   }

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={() => changeModalVisible(false)}
      >
        <View style={styles.modal}>
            <TouchableOpacity style={styles.close} onPress={() => closeModal(false, 'Not Started')}>
              <Text style={{ color: 'blue', fontSize: 20 }}>Not Started</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.close} onPress={() => closeModal(false, 'In Progress')}>
              <Text style={{ color: 'blue', fontSize: 20 }}>In Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.close} onPress={() => closeModal(false, 'Completed')}>
              <Text style={{ color: 'blue', fontSize: 20 }}>Completed</Text>
            </TouchableOpacity>
        </View>  
        <TouchableOpacity style={styles.close} onPress={() => changeModalVisible(false)}>
          <Text style={{ color: 'blue', fontSize: 20 }}>Close</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    modal: {
        width: '100%',
        paddingTop: 10,
        backgroundColor: 'white',
        marginBottom: 10
    },
    close: {
        backgroundColor: 'white',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 1
    }
})

export default StatusModal