import React from "react";
import MapView, { Marker } from "react-native-maps";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";

const RestaurantMoreInfoModal = ({ isVisible, onClose, restaurant }) => {
  return (
    <Modal visible={isVisible} onRequestClose={onClose}>
      <View
        style={{
          margin: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{ alignSelf: "flex-start", padding: 5}}
          onPress={onClose}
        >
          <Ionicons name="arrow-back" size={32} />
        </TouchableOpacity>
        <Image
          source={{ uri: restaurant?.coverImage }}
          style={{
            width: "100%",
            height: responsiveHeight(30),
            borderRadius: 10,
          }}
        />
        <Text
          style={{ fontSize: 24, fontWeight: "500", alignSelf: "flex-start" }}
        >
          {restaurant?.name}
        </Text>
        <Text
          style={{ fontSize: 18, fontWeight: "400", alignSelf: "flex-start" }}
        >
          {restaurant?.type}
        </Text>
        <MapView
          initialRegion={{
            latitude: restaurant?.location?.coordinate?.latitude,
            longitude: restaurant?.location?.coordinate?.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          style={{
            height: responsiveHeight(40),
            width: responsiveWidth(90),
            marginVertical: 20,
          }}
        >
          <Marker
            coordinate={{
              latitude: restaurant?.location?.coordinate?.latitude,
              longitude: restaurant?.location?.coordinate?.longitude,
            }}
          />
        </MapView>

        {
          //TODO: get location from maps api
        }

        <Text style={{ alignSelf: "flex-start", fontSize: 14 }}>
          Location from api
        </Text>

        <Text style={{ alignSelf: "flex-start", fontSize: 14 }}>
          Contact info of restaurant
        </Text>
        
      </View>
    </Modal>
  );
};

export default RestaurantMoreInfoModal;
