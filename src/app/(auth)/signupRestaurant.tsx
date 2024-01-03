import RoundedButton from "@/components/button/roundedButton";
import MyTextField from "@/components/textfield/customTextfield";
import { useResponsiveProp, useTheme } from "@shopify/restyle";
import { Link } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
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
import Toast from "react-native-toast-message";

const Signup = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState({ error: false, message: "" });

  const clearState = () => {
    setEmail("");
    setPassword("");
    setConfirmPass("");
    setUserName("");
  };

  const auth = getAuth(app);

  const handleSubmit = async () => {
    if (
      email &&
      password &&
      username &&
      email.trim() !== "" &&
      password.trim() !== ""
    ) {
      if (password.trim() !== confirmPass.trim()) {
        Toast.show({ type: "error", text1: "Password doesn't match"  });
        clearState();
        return;
      }

      createUserWithEmailAndPassword(auth, email.trim(), password.trim())
        .then((userCredential) => {
          const user = userCredential.user;

          axios
            .post(process.env.EXPO_PUBLIC_API_URL + "/users", {
              uid: user.uid,
              username: username,
              admin: true,
              isRegistered: false,
            })
            .then((res) => console.log(res.data))
            .catch((e) => console.log(e));
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError({ error: true, message: errorMessage });
          clearState();
        });
    } else {
      Toast.show({ type: "error", text1: "Email or password cannot be empty" });
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
          width: useResponsiveProp({ phone: 300, md: 400, lg: 420, xxl: 450 }),
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
        <Text style={styles.header}>Sign Up</Text>

        <MyTextField
          focusColor={colors.secondaryLight}
          value={username}
          placeholder={"Username*"}
          setValue={(value: string) => setUserName(value)}
          style={styles.input}
        />

        <MyTextField
          focusColor={colors.secondaryLight}
          value={email}
          placeholder={"Email Address*"}
          setValue={(value: string) => setEmail(value)}
          style={styles.input}
          keyboardType="email-address"
        />

        <MyTextField
          focusColor={colors.secondaryLight}
          value={password}
          placeholder={"Password*"}
          setValue={(value: string) => setPassword(value)}
          style={styles.input}
          secureTextEntry={true}
        />

        <View>
          <MyTextField
            focusColor={colors.secondaryLight}
            value={confirmPass}
            placeholder={"Confirm Password*"}
            setValue={(value: string) => setConfirmPass(value)}
            style={styles.input}
            secureTextEntry={true}
          />
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
            fontColor={colors.textWhite}
            scaleFactor={1.1}
            label="Submit"
            fontSize={20}
            handlePress={handleSubmit}
            secureTextEntry={true}
          />
        </View>
      </View>
      <View style={{ display: "flex", flexDirection: "row", marginTop: 15 }}>
        <Text style={{ color: colors.text }}>Already have an account? </Text>
        <Link style={{ color: colors.link }} href={"/login"}>
          Log In
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
