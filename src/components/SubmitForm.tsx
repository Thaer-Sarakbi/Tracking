import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useUploadImages from '../hooks/useUploadImages';
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SubmitForm = ({ navigation }) => {
    const { images, chooseFromGallery, uploadImage, resetImages } = useUploadImages() 

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

        <TouchableOpacity onPress={() => handleSubmit(onSubmitReport(images, uploadImage, resetImages))} style = {{ width: '100%', height: 60, backgroundColor: Colors.main , borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
          <Text style={{ color: 'white', fontSize: 19 }}>Submit</Text>
        </TouchableOpacity>
      </View>
      )
}

const styles = StyleSheet.create({
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

export default SubmitForm