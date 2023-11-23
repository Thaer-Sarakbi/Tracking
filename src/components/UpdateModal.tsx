import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground, Alert } from 'react-native';
import { Colors } from '../assets/Colors';
import firestore, { firebase } from '@react-native-firebase/firestore'
import moment from 'moment';
import { getUpdates } from '../redux/updatesSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';
import storage from '@react-native-firebase/storage';

const UpdateModal = ({ changeModalVisible, isModalVisible, id  }) => {
    const [title, setTitle] = useState<string>()
    const [description, setDecription] = useState<string>()
    const [images, setImages] = useState<string[]>()
    const [transferred, setTransferred] = useState(0);

    const dispatch = useDispatch<AppDispatch>()

   const closeModal = (bool: boolean, data: string) => {
     changeModalVisible(bool)
     submit()
   }

   const submit = async () => {

    await firestore().collection('users').doc('ArBP1hNGf2ScyBjdiDfE').collection('tasks').doc(id).collection('updates').add({
      title, 
      description, 
      images,
      time: moment().format('MMM D')
    }).then(res => {
      changeModalVisible(false)
      dispatch(getUpdates(id))
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
      setImages(images)
    }).catch((error) => {
      console.log(error)
    })
  }

  const renderMultiImages = images?.map((image, i) => {
    return(
        <ImageBackground key={i} resizeMode='center' style={{ flex: 1, width: '100%', height: '100%' }} source={{ uri: image.path }}/> 
    )
  })

  const uploadImage = async () => {
    {
        images?.map(async(image) => {
            console.log('333')
            const { path } = image;
            const filename = path.substring(path.lastIndexOf('/') + 1);
            // console.log(filename)
            const uploadUri = Platform.OS === 'ios' ? path.replace('file://', '') : path;
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
            <TextInput
                style= {{ color: '#fff', width: '100%', height: 50, backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
                onChangeText={(text) => setTitle(text)}
                placeholder=""
            />

            <Text style = {{ fontSize: 20, color: Colors.titles, marginTop: 20 }}>Description</Text>
            <TextInput
                style= {{  marginRight: 10, color: '#fff', backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
                onChangeText={(text) => setDecription(text)}
                editable
                multiline
                numberOfLines={5}
                textAlignVertical='top'
            />

            {images ? (<View style = {{ width: '100%', height: 100, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginVertical: 5 }}>
               
                {renderMultiImages}
              
            </View>) : null}

            <TouchableOpacity onPress={() => chooseFromGallery()} style = {{ width: 100, height: 100, backgroundColor: '#BDBDBD' , borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
               <Icon name='camera-outline' color={'black'} size = {30} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.updateButton} onPress={() => closeModal(false)}>
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