import React, { useEffect, useState } from 'react';
import { ImageBackground, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../assets/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore'
import { useSelector } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { Controller, useForm } from 'react-hook-form';
import storage from '@react-native-firebase/storage';
import { promptForEnableLocationIfNeeded, isLocationEnabled } from 'react-native-android-location-enabler';
import AwesomeAlert from 'react-native-awesome-alerts';
import moment from 'moment';
import useUploadImages from '../hooks/useUploadImages';

const successfullyModal = (showAlert, setShowAlert) => (
  <AwesomeAlert
  show={showAlert}
  showProgress={false}
  title="Alert"
  message="Registered Successfully"
  closeOnTouchOutside={true}
  closeOnHardwareBackPress={false}
  // showCancelButton={true}
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

const AttendanceScreen = ({ navigation }) => {
    const [checkInNote, setCheckInNote] = useState('')
    const [checkOutNote, setCheckOutNote] = useState('')
    const [showAlert, setShowAlert] = useState(false);

    const user = useSelector((state: notificationsState) => state.auth.user)

    const onCheckInReg = () => {
      firestore().collection('users').doc(user.id).collection('checkIn').get().then((res) =>{
        
        const arr =  res.docs.filter(snapShot => {
          var dt = new Date();
          return moment(snapShot.data().time.seconds * 1000).format('L') === moment(dt).format('L')
        })
        if (arr.length > 0) {
            Geolocation.getCurrentPosition(info => {
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
            }, async(err) => {

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
            })
        } else {
          Geolocation.getCurrentPosition(info => {
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
         })
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
            Geolocation.getCurrentPosition(info => {
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
            }, async(err) => {

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
            })
        } else {
          Geolocation.getCurrentPosition(info => {
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
         })
        }
      })
  }

    const SubmitDailyReport = () => {
      const { images, chooseFromGallery, uploadImage, removeImage, resetImages } = useUploadImages() 
      console.log(images)

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
              time: new Date()
            }).then(() => {
              uploadImage()
              console.log('report updated successfully')
              setShowAlert(true)
              reset()
              resetImages()
            })
          } else {
            firestore().collection('users').doc(user.id).collection('dailyReport').add({
              dailyReport,
              images: images ? images : null,
              time: new Date()
            }).then(() => {
              uploadImage()
              console.log('report added successfully')
              setShowAlert(true)
              reset()
              resetImages()
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

        {images.length !== 0 ? (<View style = {{ width: '100%', height: 100, borderRadius: 10, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
             
          {images?.map((image, i) => {
            return(
              <View style={{ height: '100%', width: 100, justifyContent: 'center', alignItems: 'center' }}>
                <ImageBackground key={i} resizeMode='center' style={{ width: '100%', height: '100%' }} source={{ uri: image }}/> 
                <TouchableOpacity onPress={() => removeImage(i)}>
                  <Text style={{ fontSize: 20 }}>x</Text>
                </TouchableOpacity>
              </View>
            )
          })}
           
        </View>) : null}
        <TouchableOpacity onPress={() => chooseFromGallery()} style = {{ width: 100, height: 100, backgroundColor: '#BDBDBD' , borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
          <Icon name='camera-outline' color={'black'} size = {30} />
        </TouchableOpacity>

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
            // onBlur={onBlur}
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
            // onBlur={onBlur}
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
  }
})
export default AttendanceScreen;