import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Colors, Text, TextField, View } from "react-native-ui-lib";
import app from "../../configs/firebaseConfig";
import MyTextField from "@/components/textfield/customTextfield";
import { platform } from "os";
import RoundedButton from "@/components/button/roundedButton";

const styles = StyleSheet.create({
  input: {
    ...Platform.select({
      android:{
        width: responsiveWidth(70),
      },
      web:{
        width: responsiveWidth(20),
      }
    })
  },
  parentContainer: {
    backgroundColor: Colors.$backgroundDefault,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: Colors.$backgroundPrimaryLight,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    ...Platform.select({
      android: {
        width:responsiveWidth(80),
        height:responsiveHeight(50)
      },
      web:{
        width:responsiveWidth(25),
        height:responsiveHeight(50)
      }
    }),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 8,
    elevation: 10,
  }
});

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth(app);

  const handleSubmit = async () => {
    if (email && password && email.trim() !== "" && password.trim() !== "") {
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
    }
    else{
      console.log("String empty")
    }
  };

  return (
    <SafeAreaView style={styles.parentContainer}>
      <View style={styles.container}>
        <Text >Sign Up</Text>
        <MyTextField
          value={email}
          placeholder={Platform.OS === "web" ? "Email Address*" : ""}
          validate={["required", "email"]}
          validateMessage={["field is required", "Email is invalid"]}
          setValue={(value: string) => setEmail(value)}
          style={styles.input}
          hint={Platform.OS === "android" ? "Email Address*" : ""}
        />

        <MyTextField
          value={password}
          placeholder={Platform.OS === "web" ? "Password*" : ""}
          validate={["required", (value) => value.length > 6]}
          validateMessage={["field is required", "Password length needs to be 6"]}
          setValue={(value: string) => setPassword(value)}
          style={styles.input}
          secureTextEntry
          hint={Platform.OS === "android" ? "Password*" : ""}
        />

        <RoundedButton label="Submit" handlePress={handleSubmit}/>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
