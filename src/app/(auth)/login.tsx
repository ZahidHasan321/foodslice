import RoundedButton from "@/components/button/roundedButton";
import MyTextField from "@/components/textfield/customTextfield";

import { useResponsiveProp, useTheme } from "@shopify/restyle";
import { Link, router } from "expo-router";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native-ui-lib";
import app from "../../configs/firebaseConfig";
import axios from "axios";

const Signup = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ error: false, message: "" });

  const clearState = () => {
    setEmail("");
    setPassword("");
    setTimeout(() => {
      setError({ error: false, message: "" });
    }, 3000);
  };

  const auth = getAuth(app);

  const handleSubmit = async () => {
    if (email && password && email.trim() !== "" && password.trim() !== "") {
      //firebase signup function
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;

          axios
            .get(process.env.EXPO_PUBLIC_API_URL + "/users/getUser", {
              params: {
                uid: user.uid,
              },
            })
            .then((res) => {
              if (res.data.admin) {
                if (res.data.isRegistered) router.replace("/restaurant/home");
                else router.replace("/restaurantRegistration");
              } else {
                router.replace("/customer/home");
              }
            })
            .catch((err) => {
              console.log(err);
              signOut(auth);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError({ error: true, message: errorMessage });
        });
    } else {
      setError({ error: true, message: "Email or password cannot be empty" });
      clearState();
    }
  };

  const styles = StyleSheet.create({
    input: {
      ...Platform.select({
        android: {
          width: responsiveWidth(75),
        },
        web: {
          width: useResponsiveProp({ phone: 260, md: 360, lg: 360, xxl: 390 }),
          outlineStyle: "none",
        },
      }),
    },
    parentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.mainBackground,
    },
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 30,
      backgroundColor: colors.primary,
      borderRadius: 8,
      ...Platform.select({
        android: {
          width: responsiveWidth(85),
          height: responsiveHeight(60),
        },
        web: {
          width: useResponsiveProp({ phone: 300, md: 400, lg: 450, xxl: 450 }),
          height: 450,
        },
      }),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 8,
      elevation: 10,
    },
    header: {
      fontSize: 50,
      color: colors.textWhite,
      marginBottom: "auto",
      marginTop: 25,
    },
    errorMessage: {
      color: colors.error,
      fontSize: 12,
      alignSelf: "flex-start",
      marginTop: 10,
    },
  });

  return (
    <SafeAreaView style={styles.parentContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Sign In</Text>

        <MyTextField
          focusColor={colors.secondaryLight}
          value={email}
          placeholder={"Email Address*"}
          setValue={(value: string) => setEmail(value)}
          style={styles.input}
          keyboardType="email-address"
        />

        <View>
          <MyTextField
            focusColor={colors.secondaryLight}
            value={password}
            placeholder={"Password*"}
            setValue={(value: string) => setPassword(value)}
            style={styles.input}
            secureTextEntry={true}
          />

          <Animated.Text entering={FadeIn} style={styles.errorMessage}>
            {error.message}
          </Animated.Text>

          <Link style={{ color: colors.link, marginTop: 10 }} href={""}>
            Forgot Password?
          </Link>
        </View>

        <View style={{ marginBottom: 35 }}>
          <RoundedButton
            buttonWidth={useResponsiveProp({
              phone: 260,
              md: 360,
              lg: 360,
              xxl: 390,
            })}
            bgcolor={colors.secondary}
            hoveredColor={colors.secondaryHeavy}
            scaleFactor={1.1}
            label="Submit"
            fontSize={20}
            handlePress={handleSubmit}
            fontColor={colors.textWhite}
          />
        </View>
      </View>
      <View style={{ display: "flex", flexDirection: "row", marginTop: 15 }}>
        <Text style={{ color: colors.text }}>New to Foodslice? </Text>
        <Link style={{ color: colors.link }} href={"/signupCustomer"}>
          Join now
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
