import RoundedButton from "@/components/button/roundedButton";
import Map from "@/components/map/map";
import MyTextField from "@/components/textfield/customTextfield";
import restaurantTypes from "@/constants/restuarantCategory";
import { useAuth } from "@/contexts/auth";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import axios from "axios";
import { router } from "expo-router";
import _ from "lodash";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Button, Colors, Picker, Text, View } from "react-native-ui-lib";

const Registration = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [openMap, setOpenMap] = useState(null);

  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "",
    location: null,
    additionalLocationInfo: "",
    type: "",
  });

  const handleSubmit = () => {
    if (
      !restaurantInfo.name ||
      !restaurantInfo.location ||
      !restaurantInfo.additionalLocationInfo ||
      !restaurantInfo.type
    ) {
      // Display an error message or take appropriate action
      Toast.show({
        type: "error",
        text1: "Please fill in all required fields.",
      });
      return;
    }

    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/users/getUser", {
        params: {
          uid: user.uid,
        },
      })
      .then((res) => {
        axios
          .post(
            process.env.EXPO_PUBLIC_API_URL +
              "/restaurants/register-restaurant",
            {
              ...restaurantInfo,
              owner: res.data._id,
            }
          )
          .then((res) => {
            console.log(res.data);
          });
      });
    router.replace("/restaurant/home");
  };

  const styles = StyleSheet.create({
    textField: {
      height: 50,
      width: responsiveWidth(80),
      marginBottom: 20,
    },
  });

  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <SafeAreaView
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: 30,
        }}
      >
        <Text
          style={{
            alignSelf: "center",
            fontSize: 30,
            fontWeight: "600",
            marginBottom: 20,
          }}
        >
          Register Restaurant
        </Text>
        <MyTextField
          value={restaurantInfo.name}
          required
          placeholder="name"
          setValue={(value: string) =>
            setRestaurantInfo({ ...restaurantInfo, name: value })
          }
          style={styles.textField}
        />

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <MapView
            initialRegion={{
              latitude: 23.685,
              longitude: 90.3563,
              latitudeDelta: 5,
              longitudeDelta: 5,
            }}
            liteMode
            region={{
              ...restaurantInfo?.location?.coordinate,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            style={{ width: responsiveWidth(80), height: responsiveHeight(40) }}
          >
            {restaurantInfo?.location && (
              <Marker
                coordinate={{
                  ...restaurantInfo?.location?.coordinate,
                  latitudeDelta: 1,
                  longitudeDelta: 1,
                }}
              />
            )}
          </MapView>

          <Button onPress={() => setOpenMap(true)} label="Select location" />
        </View>

        <Map
          open={openMap}
          closeMap={() => {
            setOpenMap(false);
            console.log(openMap);
          }}
          handleSaveLocation={(value) => {
            setRestaurantInfo({ ...restaurantInfo, location: value });
          }}
        />

        <MyTextField
          value={restaurantInfo.additionalLocationInfo}
          placeholder="Additional Location Info"
          setValue={(value: string) =>
            setRestaurantInfo({
              ...restaurantInfo,
              additionalLocationInfo: value,
            })
          }
          style={styles.textField}
        />

        <Picker
          value={restaurantInfo.type}
          placeholder={"category"}
          enableModalBlur={false}
          onChange={(item: string) =>
            setRestaurantInfo({ ...restaurantInfo, type: item })
          }
          style={{
            height: 30,
            marginBottom: 20,
            width: responsiveWidth(70),
            borderBottomWidth: 1,
          }}
          showSearch
          searchPlaceholder={"Search a category"}
          searchStyle={{
            color: Colors.blue30,
            placeholderTextColor: Colors.grey50,
          }}
          topBarProps={{ title: "Categories" }}
          useSafeArea
          trailingAccessory={<AntDesign name="down" size={20} color="black" />}
        >
          {_.map(restaurantTypes, (item, index) => (
            <Picker.Item key={index} value={item} label={item} />
          ))}
        </Picker>

        <RoundedButton
          buttonWidth={responsiveWidth(40)}
          bgcolor={colors.secondary}
          hoveredColor={colors.secondaryHeavy}
          scaleFactor={1.1}
          label="Submit"
          fontSize={20}
          handlePress={handleSubmit}
          fontColor={colors.textWhite}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default Registration;
