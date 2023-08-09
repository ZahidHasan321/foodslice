import RoundedButton from "@/components/button/roundedButton";
import MyTextField from "@/components/textfield/customTextfield";
import { useTheme } from "@react-navigation/native";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native-ui-lib";
import app from "../../configs/firebaseConfig";

const Signup = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const auth = getAuth(app);

  const handleSubmit = async () => {
    if (email && password && email.trim() !== "" && password.trim() !== "") {
      if(password.trim() !== confirmPass.trim())
      createUserWithEmailAndPassword(auth, email.trim(), password.trim())
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
        });
    } else {
      console.log("String empty");
    }
  };

  const styles = StyleSheet.create({
    input: {
      ...Platform.select({
        android: {
          width: responsiveWidth(75),
        },
        web: {
          width: responsiveWidth(20),
        },
      }),
    },
    parentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap:30,
      backgroundColor: colors.primary,
      borderRadius: 8,
      ...Platform.select({
        android: {
          width: responsiveWidth(85),
          height: responsiveHeight(60),
        },
        web: {
          width: responsiveWidth(25),
          height: responsiveHeight(55),
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
      ...Platform.select({
        android: {
          fontSize: responsiveFontSize(6),
        },
        web: {
          fontSize: responsiveFontSize(3),
        },
      }),
      color: colors.white,
      marginBottom: "auto",
      marginTop: 25,
    },
  });

  return (
    <SafeAreaView style={styles.parentContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Sign Up</Text>

        <MyTextField
          focusColor={colors.secondaryLight}
          value={email}
          placeholder={"Email Address*"}
          setValue={(value: string) => setEmail(value)}
          style={styles.input}
        />

        <MyTextField
          focusColor={colors.secondaryLight}
          value={password}
          placeholder={"Password*"}
          setValue={(value: string) => setPassword(value)}
          style={styles.input}
          secureTextEntry
        />

        <MyTextField
          focusColor={colors.secondaryLight}
          value={confirmPass}
          placeholder={"Confirm Password*"}
          setValue={(value: string) => setConfirmPass(value)}
          style={styles.input}
          secureTextEntry
        />

        <RoundedButton
          buttonWidth={Platform.OS === "web" ? 20 : 70}
          style={{ marginBottom:30, marginTop:20 }}
          bgcolor={colors.secondary}
          hoveredColor={colors.secondaryHeavy}
          label="Submit"
          handlePress={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
};

export default Signup;