import React, { useState } from 'react';
import { ImageSlider } from "react-native-image-slider-banner";
import ImageView from "react-native-image-viewing";
import { User } from '../types/types';

const ImagesSlider = ({images, user}: {images: any, user: User}) => {
    const [isVisible, setIsVisible] = useState(false)
    const [index, setIndex] = useState(0)

    const images1 = images?.map((image: string) => {
        return( 
          { img: `https://firebasestorage.googleapis.com/v0/b/tracking-6569e.appspot.com/o/${image?.substring(image.lastIndexOf('/') + 1)}?alt=media&token=${user.deviceToken}`}
        )
      })
      
      const images2 = images?.map((image : string) => {
        return(
            { uri: `https://firebasestorage.googleapis.com/v0/b/tracking-6569e.appspot.com/o/${image?.substring(image.lastIndexOf('/') + 1)}?alt=media&token=${user.deviceToken}`}
        )
      })

  return(
    <>
        <ImageSlider 
          data={images1}
          preview={false}
          caroselImageContainerStyle={{ height: 340 }}
          onItemChanged={(item) => console.log("item", item)}
          caroselImageStyle={{ resizeMode: 'cover' }}
          onClick={(item, index) => { 
            setIsVisible(true)
            setIndex(index)
          }}
        />

       <ImageView
        images={images2}
        imageIndex={index}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        onImageIndexChange={(i) => setIndex(i)}
       />
    </>
  )
}

export default ImagesSlider