import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { TextField } from "react-native-ui-lib";

export type textfieldState = Readonly<{
  isFocused: boolean;
}>;

type textfield = {
  value: any;
  setValue: any;
  placeholder: string;
  style?: any;
  bgcolor?: string;
  focusColor?: string;
  [x: string]: any;
};

const MyTextField = ({
  value = "",
  bgcolor = "#FFFFFF",
  setValue,
  placeholder,
  focusColor,
  style,
  ...props
}: textfield) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused((focused) => !focused);
  };

  const handleBlur = () => {
    setFocused((focused) => !focused);
  };

  const styles = StyleSheet.create({
    input: {
      backgroundColor: bgcolor,
      borderRadius: 8,
      borderWidth: 0,
      height: 50,
      padding: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
  });

  return (
    <TextField
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={[
        styles.input,
        focused ? { borderWidth: 2, borderColor: focusColor } : null,
        style,
      ]}
      placeholder={placeholder}
      placeholderTextColor={"gray"}
      value={value}
      underlineColorAndroid="transparent"
      onChangeText={(value: string) => setValue(value)}
      {...props}
    />
  );
};

export default MyTextField;
