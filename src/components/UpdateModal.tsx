import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground, Platform, ActivityIndicator } from 'react-native';
import { Colors } from '../assets/Colors';
import firestore from '@react-native-firebase/firestore'
import { getUpdates } from '../redux/updatesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import Icon from 'react-native-vector-icons/Ionicons';
import { Controller, useForm } from 'react-hook-form';
import { addNotification } from '../redux/notificationsSlice';
import { User } from '../types/types';
import Geolocation from '@react-native-community/geolocation';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import useUploadImages from '../hooks/useUploadImages';

interface Props {
  changeModalVisible: (boole: boolean) => void,
  isModalVisible: boolean,
  id: string,
  userId: string,
  assigenId: string,
  admin: boolean,
  updaterName: string
}

interface MyState {
  auth: {user: User}
}

const UpdateModal = ({ changeModalVisible, isModalVisible, id, userId, assigenId, admin, updaterName } : Props) => {
    const [modalLoading, setModalStatusLoading] = useState<boolean>(false)
    const user = useSelector((state: MyState) => state.auth.user)
    const { images, chooseFromGallery, uploadImage } = useUploadImages() 

    const {
      control,
      handleSubmit,
      formState: { errors },
      watch
    } = useForm({
      defaultValues: {
        title: "",
        description: "",
        images: ""
      },
    })

    const dispatch = useDispatch<AppDispatch>()

    const submit = async () => {

    const { title, description } = watch()

    Geolocation.getCurrentPosition(info => {
      firestore().collection('users').doc(assigenId).collection('tasks').doc(id).collection('updates').add({
        title, 
        description, 
        images: images ? images : null,
        time: new Date(),
        updatedBy: updaterName,
        taskId: id,
        assigenId,
        latitude: info.coords.latitude, 
        longitude: info.coords.longitude
      }).then(res => {
        if(user.admin){
          dispatch(addNotification({notification:{
            screen: 'UpdateDetails',
            message: `${user.name} added a new Update`,
            read: false,
            taskId: id,
            time: new Date(),
            creationDateNotification: new Date(),
            updateId: res.id,
            images,
            title,
            description,
            updatedBy: updaterName,
            assigenId,
            receiverId: assigenId,
            latitude: info.coords.latitude, 
            longitude: info.coords.longitude
        }})).then(() => {
          setModalStatusLoading(false)
        })
        } else {
          dispatch(addNotification({notification:{
            screen: 'UpdateDetails',
            message: `${user.name} added a new Update`,
            read: false,
            taskId: id,
            time: new Date(),
            creationDateNotification: new Date(),
            updateId: res.id,
            images,
            title,
            description,
            updatedBy: updaterName,
            assigenId,
            receiverId: 'D7WNpRZb6d1j0WjuDtEJ',
            latitude: info.coords.latitude, 
            longitude: info.coords.longitude
        }})).then(() => {
          setModalStatusLoading(false)
        })
        }
        changeModalVisible(false)
        dispatch(getUpdates({taskId: id, userId}))
      }).catch(err => {
        changeModalVisible(false)
        console.log(err)
      })

      uploadImage()
  }, async(err) => {

      if (Platform.OS === 'android') {
        try {
          const enableResult = await promptForEnableLocationIfNeeded();
          if(enableResult === 'enabled'){
            setModalStatusLoading(true)
            submit()
          }
          
        } catch (error: unknown) {
          console.log('error')
        }
      }
  },{}) 
  } 

  const renderMultiImages = images?.map((image, i) => {
    return(
        <ImageBackground key={i} resizeMode='center' style={{ flex: 1, width: '100%', height: '100%' }} source={{ uri: image }}/> 
    )
  })

    return (
      <View
        style={[styles.container, isModalVisible ? { backgroundColor: 'rgba(0, 0, 0, 0.5)' } : {}]}
      >
        <View style={styles.modal}>
          {!modalLoading ? (<><Text style = {{ fontSize: 20, color: Colors.titles }}>Title</Text>

          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Title is required'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => {
             return(
              <TextInput
                autoCapitalize='none'  
                style= {{ color: '#fff', width: '100%', height: 50, backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}}
            name="title"
          />
          {errors.title && <Text style={{ color: 'red', fontSize: 15 }}>{errors.title?.message}</Text>}

            <Text style = {{ fontSize: 20, color: Colors.titles, marginTop: 20 }}>Description</Text>

        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Description is required'
            }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style= {{  marginRight: 10, color: '#fff', backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
              editable
              multiline
              numberOfLines={5}
              textAlignVertical='top'
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
              )}
              name="description"
          />
          {errors.description && <Text style={{ color: 'red', fontSize: 15 }}>{errors.description?.message}</Text>}

            {images.length !== 0 ? (<View style = {{ width: '100%', height: 100, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginVertical: 5 }}>
               
                {renderMultiImages}
              
            </View>) : null}

            <TouchableOpacity onPress={() => chooseFromGallery()} style = {{ width: 100, height: 100, backgroundColor: '#BDBDBD' , borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
               <Icon name='camera-outline' color={'black'} size = {30} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.updateButton} onPress={handleSubmit(submit)}>
              <Text style={{ fontSize: 20, color: 'white' }}>Proceed</Text>
            </TouchableOpacity></>) : (
               <View style={styles.loader}>
                 <ActivityIndicator size='large' />
               </View>
            )}
        </View> 
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        // height: 200,
        width: '80%',
        paddingTop: 10,
        backgroundColor: 'white',
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5
    },
    close: {
        // flex: 1,
        backgroundColor: 'white',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 1
    },
    updateButton:{
        backgroundColor: Colors.main,
        marginTop: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    loader:{
      marginTop: 10,
      alignItems: 'center'
    }
})

export default UpdateModal