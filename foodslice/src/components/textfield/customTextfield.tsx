import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Colors, TextField } from "react-native-ui-lib";

export type textfieldState = Readonly<{
  isFocused: boolean;
}>;

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.$backgroundDefault,
    borderRadius: 8,
    height: 50,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  floatingPlaceholder: {
    height: 50,
    paddingLeft: 10,
    paddingTop: 15,
  },
});

type textfield = {
  value: any;
  setValue: any;
  placeholder: string;
  validate: any;
  validateMessage: string[];
  style: any;
  [x: string]: any;
};

const MyTextField = ({
  value,
  setValue,
  placeholder,
  validate,
  validateMessage,
  style,
  ...props
}: textfield) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () =>{
    setFocused(focused => !focused)
  }

  const handleBlur = () => {
    setFocused(focused => !focused)
  }

  return (
    <TextField
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={[styles.input,focused ? {borderWidth:1, borderColor:Colors.green20} : null, style]}
      placeholder={placeholder}
      value={value}
      floatingPlaceholder
      floatOnFocus
      floatingPlaceholderStyle={styles.floatingPlaceholder}
      onChangeText={(value) => setValue(value)}
      enableErrors
      validate={validate}
      validationMessage={validateMessage}
      {...props}
    />
  );
};

export default MyTextField;
