import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import storage from '@react-native-firebase/storage';

export default function useUploadImages(){
  const [images, setImages] = useState<string[]>([])
  const [transferred, setTransferred] = useState(0);

  // useEffect(() => {
  //   chooseFromGallery()
  // },[])

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

  const compressAndResizeImage = async (originalUri: {path: string}) => {

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
} 

const resetImages = () => {
  setImages([])
}

  return {images,chooseFromGallery, uploadImage, resetImages}
}