import React, { useEffect, useState } from 'react';
import { ImageBackground, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../assets/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore'
import { useSelector } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { Controller, useForm } from 'react-hook-form';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import AwesomeAlert from 'react-native-awesome-alerts';
import moment from 'moment';
import useUploadImages from '../hooks/useUploadImages';
import { DocFile, UserState } from '../types/types';
import useUploadDocument from '../hooks/useUploadDocument';

const successfullyModal = (showAlert: boolean, setShowAlert: (showAlert: boolean) => void) => (
  <AwesomeAlert
  show={showAlert}
  showProgress={false}
  title="Alert"
  message="Registered Successfully"
  closeOnTouchOutside={true}
  closeOnHardwareBackPress={false}
  showConfirmButton={true}
  cancelText="No, cancel"
  confirmText="Ok" 
  confirmButtonColor="#DD6B55"
  confirmButtonStyle={{
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }}
  confirmButtonTextStyle={{
    fontSize: 15
  }}
  onConfirmPressed={() => {
    setShowAlert(false)
  }}
/>
)

const AttendanceScreen = () => {
    const [checkInNote, setCheckInNote] = useState<string>('')
    const [checkOutNote, setCheckOutNote] = useState<string>('')
    const [showAlert, setShowAlert] = useState(false);

    const user = useSelector((state: UserState) => state.auth.user)

    const onCheckInReg = () => {
      firestore().collection('users').doc(user.id).collection('checkIn').get().then((res) =>{
        
        const arr =  res.docs.filter(snapShot => {
          var dt = new Date();
          return moment(snapShot.data().time.seconds * 1000).format('L') === moment(dt).format('L')
        })
        if (arr.length > 0) {
            Geolocation.getCurrentPosition((info: {coords:{latitude: number, longitude: number}}) => {
              firestore().collection('users').doc(user.id).collection('checkIn').doc(arr[0].id).update({
                time: new Date(),
                latitude: info.coords.latitude, 
                longitude: info.coords.longitude,
                note: checkInNote
              }).then((res) => {
                setCheckInNote('')
                console.log('Updated successfully')
                setShowAlert(true)
              }).catch((err) => {
                console.log(err)
              })
            }, async(err: string) => {

              if (Platform.OS === 'android') {
                try {
                  const enableResult = await promptForEnableLocationIfNeeded();
                  if(enableResult === 'enabled'){
                    onCheckInReg()
                  }
                } catch (error: unknown) {
                  console.log('error')
                }
              }
            }, {})
        } else {
          Geolocation.getCurrentPosition((info: {coords:{latitude: number, longitude: number}}) => {
            firestore().collection('users').doc(user.id).collection('checkIn').add({
            time: new Date(),
            latitude: info.coords.latitude, 
            longitude: info.coords.longitude,
            note: checkInNote
          }).then((res) => {
            console.log('Added successfully')
            setCheckInNote('')
            setShowAlert(true)
          })
         }, (err: string) => {

         }, {})
        }
      })
    }
    
    const onCheckOutReg = () => {
      firestore().collection('users').doc(user.id).collection('checkOut').get().then((res) =>{
        
        const arr =  res.docs.filter(snapShot => {
          var dt = new Date();
          return  moment(snapShot.data().time.seconds * 1000).format('L') === moment(dt).format('L')
        })
        if (arr.length > 0) {
            Geolocation.getCurrentPosition((info: {coords:{latitude: number, longitude: number}}) => {
              firestore().collection('users').doc(user.id).collection('checkOut').doc(arr[0].id).update({
                time: new Date(),
                latitude: info.coords.latitude, 
                longitude: info.coords.longitude,
                note: checkOutNote
              }).then((res) => {
                setCheckOutNote('')
                console.log('Updated successfully')
                setShowAlert(true)
              }).catch((err) => {
                console.log(err)
              })
            }, async(err: string) => {

              if (Platform.OS === 'android') {
                try {
                  const enableResult = await promptForEnableLocationIfNeeded();
                  if(enableResult === 'enabled'){
                    onCheckOutReg()
                  }
                } catch (error: unknown) {
                  console.log('error')
                }
              }
            },{})

        } else {
          Geolocation.getCurrentPosition((info: {coords:{latitude: number, longitude: number}}) => {
            firestore().collection('users').doc(user.id).collection('checkOut').add({
            time: new Date(),
            latitude: info.coords.latitude, 
            longitude: info.coords.longitude,
            note: checkOutNote
          }).then((res) => {
            console.log('Added successfully')
            setCheckOutNote('')
            setShowAlert(true)
          })
         }, (err: string) => {

         }, {})
        }
      })
  }

    const SubmitDailyReport = () => {
      const { images, outputFilename, chooseFromGallery, uploadImage, resetImages, removeImage, uploadPdf } = useUploadImages() 
      const { pickFile, uploadFile, removeFile, selectedFile } = useUploadDocument()

      const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch
      } = useForm({
        defaultValues: {
          dailyReport: ""
        },
      })

      const onSubmitReport = async () => {
        const { dailyReport } = watch()
  
        await firestore().collection('users').doc(user.id).collection('dailyReport').get()
        .then((res) => {
          const arr =  res.docs.filter(snapShot => {
            var dt = new Date();
            return  moment(snapShot.data().time.seconds * 1000).format('L') === moment(dt).format('L')
          })
          if (arr.length > 0) {
            firestore().collection('users').doc(user.id).collection('dailyReport').doc(arr[0].id).update({
              dailyReport,
              images: images ? images : null,
              pdf: outputFilename,
              files: selectedFile ? selectedFile : null,
              time: new Date()
            }).then(async() => {
              if(images?.length > 0 && selectedFile.length === 0){
                const uploadedWell = await uploadImage()
                const uploadPdfWell = await uploadPdf()
                if(uploadedWell && uploadPdfWell){
                  console.log('report updated successfully')
                  setShowAlert(true)
                }
              } else if(selectedFile?.length > 0 && images.length === 0){
                const uploadedWell = await uploadFile()
                if(uploadedWell){
                  console.log('report updated successfully')
                  setShowAlert(true)
                }
              } else if(selectedFile?.length > 0 && images?.length > 0){
                const uploadedWell = await uploadImage()
                const uploadPdfWell = await uploadPdf()
                const uploadedFileWell = await uploadFile()
                if(uploadedWell && uploadPdfWell && uploadedFileWell){
                  console.log('report updated successfully')
                  setShowAlert(true)
                }
              } else {
                console.log('report updated successfully')
                setShowAlert(true)
              }
              
              reset()
              resetImages()
              //resetFiles()
            })
          } else {
            firestore().collection('users').doc(user.id).collection('dailyReport').add({
              dailyReport,
              images: images ? images : null,
              pdf: outputFilename,
              files: selectedFile ? selectedFile : null,
              time: new Date()
            }).then(async() => {
              if(images?.length > 0 && selectedFile.length === 0){
                const uploadedWell = await uploadImage()
                const uploadPdfWell = await uploadPdf()
                if(uploadedWell && uploadPdfWell){
                  console.log('report updated successfully')
                  setShowAlert(true)
                }
              } else if(selectedFile?.length > 0 && images.length === 0){
                const uploadedWell = await uploadFile()
                if(uploadedWell){
                  console.log('report updated successfully')
                  setShowAlert(true)
                }
              } else if(selectedFile?.length > 0 && images?.length > 0){
                const uploadedWell = await uploadImage()
                const uploadPdfWell = await uploadPdf()
                const uploadedFileWell = await uploadFile()
                if(uploadedWell && uploadPdfWell && uploadedFileWell){
                  console.log('report updated successfully')
                  setShowAlert(true)
                }
              } else {
                console.log('report updated successfully')
                setShowAlert(true)
              }
              
              reset()
              resetImages()
              //resetFiles()
            })
          }
      })
      }

      return(
        <View style={styles.card}>
        <Text style={styles.titles}>Today Report</Text>
        <Text style={{ fontSize: 18 }}>Tell us what did you do today</Text>
        <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Report is required'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style= {{ color: '#fff', backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
            editable
            multiline
            numberOfLines={5}
            textAlignVertical='top'
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
          )}
            name="dailyReport"
          />

        {errors.dailyReport && <Text style={{ color: 'red', fontSize: 15 }}>{errors.dailyReport?.message}</Text>}

        {selectedFile?.map((doc: DocFile, i: number) => {
          return <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text key={i} style={{ marginVertical: 5 }}>{doc.name}</Text>
            <TouchableOpacity onPress={() => removeFile(i)}>
              <Icon name='close-circle-outline' color={'black'} size = {20} />
            </TouchableOpacity>
          </View>
        })}

        {images.length !== 0 ? (<View style = {{ width: '100%', height: 100, borderRadius: 10, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
             
          {images?.map((image, i) => {
            return(
              <View key={i} style={{ height: '100%', width: 100, justifyContent: 'center', alignItems: 'center' }}>
                <ImageBackground key={i} resizeMode='center' style={{ width: '100%', height: '100%' }} source={{ uri: image }}/> 
                <TouchableOpacity onPress={() => removeImage(i)}>
                  <Text style={{ fontSize: 20 }}>x</Text>
                </TouchableOpacity>
              </View>
            )
          })}
           
        </View>) : null}

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => chooseFromGallery()} style = {{ width: 100, height: 100, backgroundColor: '#BDBDBD' , borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginVertical: 5, marginRight: 10 }}>
            <Icon name='camera-outline' color={'black'} size = {30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pickFile()} style = {{ width: 100, height: 100, backgroundColor: '#BDBDBD' , borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
            <Icon name='cloud-upload-outline' color={'black'} size = {30} />
          </TouchableOpacity>
        </View>

          <TouchableOpacity onPress={handleSubmit(onSubmitReport)} style = {{ width: '100%', height: 60, backgroundColor: Colors.main , borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
            <Text style={{ color: 'white', fontSize: 19 }}>Submit</Text>
          </TouchableOpacity>
      </View>
      )
    }

    const SubmitLeaveForm = () => {
      const { images, chooseFromGallery, uploadImage, resetImages } = useUploadImages() 

      const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch
      } = useForm({
        defaultValues: {
          reason: ""
        },
      })

      const onSubmitLeave = () => {
        const { reason } = watch()
  
        firestore().collection('users').doc(user.id).collection('leave').get()
        .then((res) => {
          const arr =  res.docs.filter(snapShot => {
            var dt = new Date();
            return  moment(snapShot.data().time.seconds * 1000).format('L') === moment(dt).format('L')
          })
          if (arr.length > 0) {
            firestore().collection('users').doc(user.id).collection('leave').doc(arr[0].id).update({
              reason,
              images: images ? images : null,
              time: new Date()
            }).then(() => {
              uploadImage()
              console.log('leave report updated successfully')
              setShowAlert(true)
              reset()
              resetImages()
            })
          } else {
            firestore().collection('users').doc(user.id).collection('leave').add({
              reason,
              images: images ? images : null,
              time: new Date()
            }).then(() => {
              uploadImage()
              console.log('leave report added successfully')
              setShowAlert(true)
              reset()
              resetImages()
            })
          }
      })
      }

      return(
        <View style={styles.card}>
        <Text style={styles.titles}>Leave</Text>
        <Text style={{ fontSize: 18 }}>Tell us what the reason</Text>
        <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Reason is required'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style= {{ color: '#fff', backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
            editable
            multiline
            numberOfLines={5}
            textAlignVertical='top'
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
          )}
            name="reason"
          />

        {errors.reason && <Text style={{ color: 'red', fontSize: 15 }}>{errors.reason?.message}</Text>}

        {images.length !== 0 ? (<View style = {{ width: '100%', height: 100, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginVertical: 5 }}>
             
          {images?.map((image, i) => {
            return(
              <ImageBackground key={i} resizeMode='center' style={{ flex: 1, width: '100%', height: '100%' }} source={{ uri: image }}/> 
            )
          })}
           
        </View>) : null}
        <TouchableOpacity onPress={() => chooseFromGallery()} style = {{ width: 100, height: 100, backgroundColor: '#BDBDBD' , borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
          <Icon name='camera-outline' color={'black'} size = {30} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmit(onSubmitLeave)} style = {{ width: '100%', height: 60, backgroundColor: Colors.main , borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
          <Text style={{ color: 'white', fontSize: 19 }}>Submit</Text>
        </TouchableOpacity>
      </View>
      )
    }

    return(
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.titles}>Check In</Text>
          <Text style={{ fontSize: 18 }}>Notes</Text>
          <TextInput
            style= {{ color: '#fff', backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
            editable
            multiline
            numberOfLines={5}
            textAlignVertical='top'
            onChangeText={setCheckInNote}
            value={checkInNote}
          />

          <TouchableOpacity onPress={() => onCheckInReg()} style={{ backgroundColor: Colors.main, height: 55, marginTop: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 17 }}>Register</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.titles}>Check Out</Text>
          <Text style={{ fontSize: 18 }}>Notes</Text>
          <TextInput
            style= {{ color: '#fff', backgroundColor: '#BDBDBD', marginTop: 5, borderRadius: 10, fontSize: 15 }}
            editable
            multiline
            numberOfLines={5}
            textAlignVertical='top'
            onChangeText={setCheckOutNote}
            value={checkOutNote}
          />

          <TouchableOpacity onPress={() => onCheckOutReg()} style={{ backgroundColor: Colors.main, height: 55, marginTop: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 17 }}>Register</Text>
          </TouchableOpacity>
        </View>

        <SubmitDailyReport />
        <SubmitLeaveForm />
        {successfullyModal(showAlert, setShowAlert)}
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10
  },
  card: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10
  },
  titles: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'black'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#32a9d9',
    padding: 10,
    borderRadius: 10,
  },

})
export default AttendanceScreen;