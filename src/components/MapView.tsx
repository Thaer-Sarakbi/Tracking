import React from 'react';
import MapView, {Marker} from "react-native-maps";

const MapViewComponent = ({ longitude, latitude }: { longitude: string | undefined, latitude: string | undefined }) => (
    <>
      <MapView
        style={{ width: '100%', height: 300, marginVertical: 10, borderRadius: 5 }}
        initialRegion={{
          longitude: longitude ? Number(longitude) : 0,
          latitude: latitude ? Number(latitude) : 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
            >
            <Marker
                coordinate={{
                longitude: longitude ? Number(longitude) : 0,
                latitude: latitude ? Number(latitude) : 0
                }}
                pinColor={"red"}
            />
        </MapView>
    </>
)

export default MapViewComponent