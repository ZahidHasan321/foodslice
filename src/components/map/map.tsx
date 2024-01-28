import React, { useEffect, useState } from "react";
import { BackHandler, PermissionsAndroid, StyleSheet } from "react-native";
import MapView, {
    Marker,
    PROVIDER_GOOGLE
} from "react-native-maps";
import { Modal, Text, TouchableOpacity, View } from "react-native-ui-lib";

const Map = ({ open, closeMap, handleSaveLocation}) => {
  const [marker, setMarker] = useState(null);
  const mapRef = React.useRef(null);
  const [locationName, setLocationName] = useState(null);

  useEffect(() => {
    // Request location permission when the component mounts
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
      } else {
        console.warn('Location permission denied');
      }
    } catch (err) {
      console.error('Error requesting location permission:', err);
    }
  };

  const handleSavePress = () => {
    handleSaveLocation(marker)
    closeMap()
  };


  const handleLongPress = async event => {
    const { coordinate } = event.nativeEvent;
    const name = await getLocationName(coordinate);
    setMarker({
      id: Date.now(),
      coordinate,
    });

    setLocationName(name);
  };

  const getLocationName = async (coordinate) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );

      const data = await response.json();

      if (data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        return 'Unknown Location';
      }
    } catch (error) {
      console.error('Error getting location name:', error);
      return 'Unknown Location';
    }
  };

  const handleBackPress = () => {
    closeMap()
  }

  return (
    <Modal
      visible={open}
      onRequestClose={() => closeMap()}
      style={{ flex: 1 }}
    >
      <MapView
        style={{ width: "100%", height: "100%", marginBottom: 10 }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
        initialRegion={{
            latitude: 22.3569,
            longitude: 91.7832,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        onLongPress={handleLongPress}
      >
                 {marker && (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={locationName || 'Selected Location'}
          />
        )}
      </MapView>

      {!marker && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>Long press on the map to add a marker</Text>
        </View>
      )}
        {marker && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSavePress}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  hintContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  hintText: {
    fontSize: 16,
    textAlign: 'center',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Map;
