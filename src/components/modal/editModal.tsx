import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Colors,
  Image,
  Incubator,
  Modal,
  Picker,
  Text,
  TextField,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@shopify/restyle";
import axios from "axios";

import _ from "lodash";
import restaurantCategories from "@/constants/foodCategory";
import useImgBB from "@/hooks/useIMGBB";
import Toast from "react-native-toast-message";

const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    borderWidth: 0,
    height: 50,
    padding: 10,
    minWidth: 80,
  },
});

const EditItem = ({ open, handleModalClose, item }) => {
  const [editedItem, setEditedItem] = useState(item);
  const [ disabled, setDisabled ] = useState(false)
  const { colors } = useTheme();

  const [image, setImage] = useState(null);

  const [isSuccess, setIsSuccess] = useState({
    value: false,
    message: "",
  });

  const [isError, setIsError] = useState({
    value: false,
    message: "",
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const clearState = () => {
    setIsSuccess({ value: false, message: "" });
    setIsError({ value: false, message: "" });
  };

  const handleSubmit = async () => {
    if (
      editedItem.name.trim() == "" ||
      editedItem.price === null ||
      editedItem.category.trim() == "" ||
      editedItem.image === null ||
      editedItem.ingredients.trim() == ""
    ) {
      Toast.show({type:'error', text1:"Fields cannot be empty"});
    } else {
      setDisabled(true);
      const imageUrl = (await image)
        ? await useImgBB(image.uri, editedItem.name)
        : editedItem.image;

      await axios
        .post(
          process.env.EXPO_PUBLIC_API_URL + "/items/update-item",
          { ...editedItem, image: imageUrl },
          {
            headers: {
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          res.data.value
            ? Toast.show({ type: "success", text1: "updated successfully" })
            : Toast.show({ type: "error", text1: "Failed to update" });
        })
        .catch((e) => console.error(e));

        setDisabled(false);
        
    }
  };

  const handleModalState = () => {
    handleModalClose(false);
  };
  return (
    <Modal visible={open} onRequestClose={handleModalState}>
      <SafeAreaView
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Image
          source={{
            uri: image?.uri || item?.image,
          }}
          style={{
            height: responsiveHeight(30),
            width: responsiveWidth(100),
          }}
        />

        <TouchableOpacity
          onPress={pickImage}
          style={{ alignSelf: "flex-start" }}
        >
          <Text text70 style={{ color: colors.link }}>
            Choose Image
          </Text>
        </TouchableOpacity>

        {/* Name of item */}
        <View
          marginL-8
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text text70 style={{ fontWeight: "bold" }}>
            Name:
          </Text>
          <TextField
            style={{ ...styles.input }}
            defaultValue={item?.name}
            value={editedItem?.name}
            onChangeText={(value: string) => {
              setEditedItem({ ...editedItem, name: value });
            }}
          />
        </View>

        {/* Price of item */}
        <View
          marginL-8
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text text70 style={{ fontWeight: "bold" }}>
            Price:
          </Text>
          <TextField
            keyboardType="numeric"
            style={{ ...styles.input }}
            defaultValue={item.price.toString()}
            onChangeText={(value: string) =>
              setEditedItem({ ...editedItem, price: parseInt(value) })
            }
          />
        </View>

        {/* category of item */}

        <View
          marginL-8
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            gap: 4,
            alignItems: "center",
          }}
        >
          <Text text70 style={{ fontWeight: "bold" }}>
            Category:
          </Text>
          {/* <TextField
            style={{ ...styles.input }}
            defaultValue={item?.category}
            value={editedItem?.category}
            onChangeText={(value: string) => {
              setEditedItem({ ...editedItem, category: value });
            }}
          /> */}

          <Picker
            value={editedItem.category}
            placeholder={"category"}
            defaultValue={editedItem.category}
            enableModalBlur={false}
            onChange={(item: string) =>
              setEditedItem({ ...editedItem, category: item })
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
            trailingAccessory={
              <AntDesign name="down" size={20} color="black" />
            }
          >
            {_.map(restaurantCategories, (item, index) => (
              <Picker.Item key={index} value={item} label={item} />
            ))}
          </Picker>
        </View>

        <View
          marginL-8
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text text70 style={{ fontWeight: "bold" }}>
            Ingredients:
          </Text>
          <TextField
            style={{ ...styles.input }}
            defaultValue={item?.ingredients}
            value={editedItem?.ingredients}
            multiline
            numberOfLines={5}
            onChangeText={(value: string) => {
              setEditedItem({ ...editedItem, ingredients: value });
            }}
          />
        </View>

        <View
          marginL-8
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text text70 style={{ fontWeight: "bold" }}>
            Description:
          </Text>
          <TextField
            style={{ ...styles.input }}
            defaultValue={item?.description}
            value={editedItem?.description}
            multiline
            numberOfLines={5}
            onChangeText={(value: string) => {
              setEditedItem({ ...editedItem, description: value });
            }}
          />
        </View>

        <Button
          disabled = {disabled}
          label="Submit"
          onPress={handleSubmit}
          backgroundColor={colors.secondary}
          size="large"
          style={{
            marginTop: 30,
            marginBottom: 30,
            width: 120,
            alignSelf: "center",
          }}
        />
      </SafeAreaView>
      <Toast />
    </Modal>
  );
};

export default EditItem;
