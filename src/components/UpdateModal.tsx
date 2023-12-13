import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground, Alert } from 'react-native';
import { Colors } from '../assets/Colors';
import firestore, { firebase } from '@react-native-firebase/firestore'
import { getUpdates } from '../redux/updatesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';
import storage from '@react-native-firebase/storage';
import { Controller, useForm } from 'react-hook-form';
import ImageResizer from '@bam.tech/react-native-image-resizer';

interface Props {
  changeModalVisible: (boole: boolean) => void,
  isModalVisible: boolean,
  id: string,
  userId: string,
  assigenId: string,
  admin: boolean
}

const UpdateModal = ({ changeModalVisible, isModalVisible, id, userId, assigenId, admin, updaterName } : Props) => {
    const [images, setImages] = useState<string[]>([])
    const [transferred, setTransferred] = useState(0);
    const users = useSelector((state: MyState) => state.users.data)
    console.log(images)

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

  //  const closeModal = (bool: boolean, data: string) => {
  //    changeModalVisible(bool)
  //    submit()
  //  }

   const submit = async () => {

    const { title, description } = watch()

    await firestore().collection('users').doc(assigenId).collection('tasks').doc(id).collection('updates').add({
      title, 
      description, 
      images: images ? images : null,
      time: new Date(),
      updatedBy: updaterName
    }).then(res => {
      changeModalVisible(false)
      dispatch(getUpdates({taskId: id, userId, admin}))
    }).catch(err => {
      changeModalVisible(false)
      console.log(err)
    })

    uploadImage()
  } 

  const chooseFromGallery = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 300,
      multiple: true
    }).then(images => {
      // setImages(images)
      {images.map((image) => (
        compressAndResizeImage(image)
      ))}
    }).catch((error) => {
      console.log(error)
    })
  }


const compressAndResizeImage = async (originalUri) => {

  try {
    const resizedImage = await ImageResizer.createResizedImage(
      originalUri.path,
      800, // New width
      600, // New height
      'JPEG', // Compression format
      80, // Compression quality (0-100)
      0, // Rotation angle (0, 90, 180, 270)
    );

    setImages(oldArray => [...oldArray, resizedImage.uri]);
  } catch (error) {
    console.error('Error compressing image:', error);
  }
};

  const renderMultiImages = images?.map((image, i) => {
    return(
        <ImageBackground key={i} resizeMode='center' style={{ flex: 1, width: '100%', height: '100%' }} source={{ uri: image }}/> 
    )
  })

  const uploadImage = async () => {
    {
        images?.map(async(image) => {
            // const { path } = image;
            const filename = image.substring(image.lastIndexOf('/') + 1);
            // console.log(filename)
            const uploadUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
            // console.log(uploadUri)
            // setUploading(true);
            setTransferred(0);
            const task = storage()
              .ref(filename)
              .putFile(uploadUri);
              console.log(task)
            // set progress state
            task.on('state_changed', snapshot => {
              setTransferred(
                Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
              );
            });
            try {
              await task;
            } catch (e) {
              console.error(e);
            }
        })
    }

    // setUploading(false);
    // Alert.alert(
    //   'Photo uploaded!',
    //   'Your photo has been uploaded to Firebase Cloud Storage!'
    // );
} 

    return (
      <View
        style={[styles.container, isModalVisible ? { backgroundColor: 'rgba(0, 0, 0, 0.5)' } : '']}
      >
        <View style={styles.modal}>
          <Text style = {{ fontSize: 20, color: Colors.titles }}>Title</Text>

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

            {images ? (<View style = {{ width: '100%', height: 100, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginVertical: 5 }}>
               
                {renderMultiImages}
              
            </View>) : null}

            <TouchableOpacity onPress={() => chooseFromGallery()} style = {{ width: 100, height: 100, backgroundColor: '#BDBDBD' , borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
               <Icon name='camera-outline' color={'black'} size = {30} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.updateButton} onPress={handleSubmit(submit)}>
              <Text style={{ fontSize: 20, color: 'white' }}>Proceed</Text>
            </TouchableOpacity>
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
})

export default UpdateModal