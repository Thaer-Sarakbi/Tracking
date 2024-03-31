import { useState } from 'react';
import { Alert } from "react-native";
import DocumentPicker from 'react-native-document-picker'
import storage from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';
import { DocFile } from '../types/types';

export default function useUploadDocument(){
    const [selectedFile, setSelectedFile] = useState<any>([]);
    console.log(selectedFile)

    const pickFile = async () => {
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
            copyTo: 'documentDirectory',
            allowMultiSelection: true
          });

          const updatedArray = res.map((file) => {
            return{
              ...file,
              name: file.name?.replaceAll(' ', '_')
            }
          })
          setSelectedFile(updatedArray);
        } catch (error) {
          if (DocumentPicker.isCancel(error)) {
            // User cancelled the picker
            console.log('Cancelled')
          } else {
            Alert.alert('Error', 'Failed to pick file. Please try again.');
          }
    }}

    const removeFile = (index: number) => {
        const newState = selectedFile.filter((item: DocFile, i: number) => i !== index)
        setSelectedFile(newState)
    }

    const uploadFile = async () => {
        if (!selectedFile) {
          Alert.alert('Error', 'Please select a file first.');
          return;
        }

        let bool
        {
          // const fileName = selectedFile.name.replaceAll(' ', '_')
          // const task = storage()
          // .ref(fileName)
          // .putFile(selectedFile.fileCopyUri);
          // console.log(task)
          // bool = true
          // await task;

          selectedFile.map(async(file: DocFile) => {
            const fileName = file.name.replaceAll(' ', '_')
            console.log(fileName, file.fileCopyUri)
            const task = storage()
            .ref(fileName)
            .putFile(file.fileCopyUri);
            console.log(task)
           
            try{
              bool = true
              await task;
            } catch(e){
              bool = false
              console.error(e);
            }
          })
        }
      return bool
    };

    const downloadFile = async(name: string) => {
        try{
          const { config, fs } = RNFetchBlob;
          const reference = storage().ref(name)
          const url = await reference.getDownloadURL();
          const filePath = `${fs.dirs.DownloadDir}/${name}`
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

    return { selectedFile, pickFile, uploadFile, downloadFile, removeFile }
}