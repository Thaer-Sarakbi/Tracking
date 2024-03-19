import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import storage from '@react-native-firebase/storage';
import { createPdf, ImageFit, Page } from 'react-native-images-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';

export default function useUploadImages(){
  const [images, setImages] = useState<string[]>([])
  const [transferred, setTransferred] = useState(0);
  const [uri, setUri] = React.useState('');
  const [width, setWidth] = React.useState<number | undefined>(1200);
  const [height, setHeight] = React.useState<number | undefined>(1400);
  const [backgroundColor, setBackgroundColor] = React.useState('white');
  const [imageFit, setImageFit] = React.useState<ImageFit | undefined>(
    'contain'
  );
    
  const parts: string[] = [];
  if (width) {
    parts.push(`${width}w`);
  }
  if (height) {
    parts.push(`${height}h`);
  }
  parts.push(imageFit ?? 'none');

  const outputFilename = parts.join('-') + '.pdf';

  const chooseFromGallery = () => {
    console.log('lolo')
    ImagePicker.openPicker({
      width: 400,
      height: 300,
      multiple: true
    }).then(images => {
      // setImages(images)
      {images.map((image) => (
        compressAndResizeImage(image)
      ))}
      convertImgToPdf(images)
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

const convertImgToPdf = async (pdfImages: { path: string }[]) => {

  try {

      const pages: Page[] = [];
      pdfImages.forEach(image => {
        pages.push({
          imagePath: image.path,
          imageFit,
          width,
          height,
          backgroundColor
        });
      })

      const uri = await createPdf({
        outputPath: `file://${RNFetchBlob.fs.dirs.DownloadDir}/${outputFilename}`,
        pages,
      });

      console.log('PDF created successfully:', uri);

      setUri(uri);
  } catch (e) {
    console.error('Failed to create PDF:', e);
  }
};

const uploadPdf = async () => {
  try{
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const task = storage()
      .ref(filename)
      .putFile(uploadUri);
      console.log(task)
      await task;
  } catch(e){
      console.log(e)
  }
} 

const downloadPdf = async(name: string) => {
  try{
    const { config, fs } = RNFetchBlob;
    const reference = storage().ref(outputFilename)
    const url = await reference.getDownloadURL();
    const filePath = `${fs.dirs.DownloadDir}/${name}-${(new Date().toJSON().slice(0,10))}.pdf`
    const exists = await fs.exists(filePath);
    if (exists) {
      await fs.unlink(filePath);
    }
    const response = await config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath
      }
    }).fetch('GET', url).then((res) => console.log(res));
    console.log('File downloaded successfully to: ')
  } catch(e){
      console.log(e)
  }

}

const removeImage = (index: number) => {
  const newState = [...images]
  newState.splice(index, 1)
  setImages(newState)
}

const resetImages = () => {
  setImages([])
}

  return {images, outputFilename, chooseFromGallery, uploadImage, removeImage, resetImages, uploadPdf, downloadPdf }
}