import React, { useState } from "react"
import MapView, { Marker, MarkerAnimated, PROVIDER_GOOGLE } from "react-native-maps";
import { Button, Modal, View } from "react-native-ui-lib";

const Map = ({open, closeMap}) => {


    const [mapRegion, setmapRegion] = useState<any>({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

    return(

        <Modal visible={open} onBackgroundPress={() => closeMap()} style={{flex:1}}>
            <MapView 
            style={{width:'100%', height:'90%', marginBottom: 10}}
                region={mapRegion}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                showsMyLocationButton
            >
                <Marker
                    draggable
                    coordinate={mapRegion}
                    onDragEnd={(e) => setmapRegion(e.nativeEvent.coordinate)}
                    
                />
            </MapView>
            <Button label="Save"/>
        </Modal>
    )
}

export default Map;