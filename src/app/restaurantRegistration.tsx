import RoundedButton from "@/components/button/roundedButton";
import MyTextField from "@/components/textfield/customTextfield";
import { useAuth } from "@/contexts/auth";
import { useTheme } from "@shopify/restyle";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  responsiveWidth
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-ui-lib";

const Registration = () => {
  const { colors } = useTheme();
  const { user } = useAuth()

  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "",
    location: "",
    type: "",
  });

  const handleSubmit = () => {
    axios
    .get(process.env.EXPO_PUBLIC_API_URL + "/users/getUser", {
      params: {
        uid: user.uid,
      },
    })
    .then(res => {

      axios.post(process.env.EXPO_PUBLIC_API_URL + '/restaurants/', {
        ...restaurantInfo,
        owner: res.data._id
      })
      .then(res => {
        console.log(res)
      })

      axios.put(process.env.EXPO_PUBLIC_API_URL + '/users/updateReg', {
        uid: user.uid
      })
      .then(res => {
        console.log(res.data)
        router.replace('/restaurant/')
      })

     

    })
  };

  const styles = StyleSheet.create({
    textField: {
      height: 50,
      width: responsiveWidth(80),
      marginBottom: 20,
    },
  });

  return (
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
          fontWeight: '600',
          marginBottom: 30,
        }}
      >
        Register Restaurant
      </Text>
      <MyTextField
        value={restaurantInfo.name}
        placeholder="name"
        setValue={(value: string) =>
          setRestaurantInfo({ ...restaurantInfo, name: value })
        }
        style={styles.textField}
      />
      <MyTextField
        value={restaurantInfo.location}
        placeholder="location"
        setValue={(value: string) =>
          setRestaurantInfo({ ...restaurantInfo, location: value })
        }
        style={styles.textField}
      />

      <MyTextField
        value={restaurantInfo.type}
        placeholder="type"
        setValue={(value: string) =>
          setRestaurantInfo({ ...restaurantInfo, type: value })
        }
        style={styles.textField}
      />

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
  );
};

export default Registration;
