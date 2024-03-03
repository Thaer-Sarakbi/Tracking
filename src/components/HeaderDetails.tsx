import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../assets/Colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AppStack';
import { useDispatch } from 'react-redux';
import { deleteTask, getTasks } from '../redux/tasksSlice';
import AwesomeAlert from 'react-native-awesome-alerts';
import { AppDispatch } from '../redux/store';

interface Props {
  navigation: { goBack: () => void }
  taskId: string,
  assigenId: string,
  userId: string,
  admin: boolean
}

const HeaderDetails = ({ navigation, taskId, assigenId, userId, admin } : Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const [showAlert, setShowAlert] = useState<boolean>(false)

  const onDeleteTask = () => {
    setShowAlert(false)
    dispatch(deleteTask({id: taskId, assigenId }))
    dispatch(getTasks({id: userId, admin}))
    navigation.goBack()
  }

  return (
    <View style={{ backgroundColor: Colors.main, width: '100%', height: 50, justifyContent: 'space-between', paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity  onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-outline" size={35} color={'white'} />
      </TouchableOpacity>
      {admin && (<TouchableOpacity onPress={() => setShowAlert(true)} style={{ backgroundColor: 'red', width: 70, height: 35, alignItems: 'center', justifyContent: 'center', marginRight: 10, borderRadius: 10 }}>
        <Text style={{ color: 'white', fontSize: 17 }}>Delete</Text>
      </TouchableOpacity>)}

      <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Alert"
          message="Are you sure you want to delete this task?"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No"
          confirmText="Yes"
          confirmButtonColor= {Colors.main}
          onCancelPressed={() => {
            setShowAlert(false)
          }}
          onConfirmPressed={() => {
            onDeleteTask()
          }}
          contentContainerStyle={{
            width: '70%'
          }}
          titleStyle={{
            fontSize: 30,
            fontWeight: 'bold'
          }}
          messageStyle={{
            fontSize: 20,
          }}
          confirmButtonStyle={{
            width: 70,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          cancelButtonStyle={{
            width: 70,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          confirmButtonTextStyle={{
            fontSize: 15
          }}
          cancelButtonTextStyle={{
            fontSize: 15
          }}
        />
    </View>
  );
}

export default HeaderDetails;