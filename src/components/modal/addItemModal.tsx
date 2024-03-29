import MyTextField from "@/components/textfield/customTextfield";
import restaurantCategories from "@/constants/foodCategory";
import { useAuth } from "@/contexts/auth";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import _ from "lodash";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { responsiveWidth } from "react-native-responsive-dimensions";
import Toast from "react-native-toast-message";
import {
  Button,
  Colors,
  Image,
  Modal,
  Picker,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

interface Props {
  handleModal: (value: boolean) => void;
  modalVisibility: boolean;
  getItems: () => void;
}

const AddItemModal = ({ handleModal, modalVisibility, getItems }: Props) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [disabled, setDisabled] = useState(false);
  const [itemInfo, setItemInfo] = useState({
    name: "",
    ingredients: "",
    description: "",
    price: null,
    category: "",
    image: null,
  });

  const clearForm = () => {
    setItemInfo({
      name: "",
      ingredients: "",
      description: "",
      price: null,
      category: "",
      image: null,
    });
  };

  const uploadImage = async (uri) => {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri,
        type: "image/jpeg",
        name: "image.jpg",
      } as any);

      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            key: process.env.EXPO_PUBLIC_IMGBB_API_KEY,
          },
        }
      );

      // Handle the response from ImgBB
      if (response.data && response.data.data && response.data.data.url) {
        const imageUrl = response.data.data.url;
        return imageUrl;
      } else {
        Toast.show({
          type: "error",
          text1: "Error uploading image to ImgBB",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error uploading image: " + error,
      });
    }
  };


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setItemInfo({ ...itemInfo, image: result.assets[0] });
    }
  };

  const handleModelState = () => {
    handleModal(false);
  };

  const handleSubmit = async () => {
    if (
      itemInfo.name.trim() == "" ||
      itemInfo.price === null ||
      itemInfo.category.trim() == "" ||
      itemInfo.image === null ||
      itemInfo.ingredients.trim() == ""
    ) {
      Toast.show({ type: "error", text1: "Field cannot be empty" });
    } else {
      setDisabled(true)
      const imageUrl = await uploadImage(itemInfo.image.uri);

      if (typeof imageUrl !== "string") {
        Toast.show({ type: "error", text1: "Image not found" });
        setDisabled(false)
        return;
      }
  
      await axios
        .post(
          process.env.EXPO_PUBLIC_API_URL + "/items/post-item",
          { ...itemInfo, image: imageUrl, restaurant: user.uid },
          {
            headers: {
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          res.data.value
            ? (Toast.show({ type: "success", text1: res.data.message }),
              clearForm(),
              getItems())
            : Toast.show({
                type: "error",
                text1: res.data.message,
              });
        })
        .catch((e) => console.error(e));

        setDisabled(false)
    }
  };

  const styles = StyleSheet.create({
    textField: {
      width: responsiveWidth(80),
      marginBottom: 20,
    },
  });

  const renderItem = (item, index) => {
    return <Text key={index}>item</Text>;
  };
  return (
    <Modal
      visible={modalVisibility}
      onRequestClose={handleModelState}
      animationType="slide"
    >
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={handleModelState}
          style={{ alignSelf: "flex-end" }}
        >
          <AntDesign
            name="closecircle"
            size={24}
            color="black"
            style={{ marginRight: 10, marginTop: 10 }}
          />
        </TouchableOpacity>
        <View flex centerH>
          <Text style={{ alignSelf: "flex-start" }} text40 marginB-20>
            Add item
          </Text>
          <MyTextField
            value={itemInfo.name}
            placeholder="name"
            setValue={(value: string) =>
              setItemInfo({ ...itemInfo, name: value })
            }
            style={styles.textField}
          />
          <MyTextField
            value={itemInfo.price}
            placeholder="price"
            keyboardType="numeric"
            setValue={(value: number) =>
              setItemInfo({ ...itemInfo, price: value })
            }
            style={styles.textField}
          />
          {/* 
          <MyTextField
            value={itemInfo.category}
            placeholder="category"
            setValue={(value: string) =>
              setItemInfo({ ...itemInfo, category: value })
            }
            style={styles.textField}
          /> */}

          <Picker
            value={itemInfo.category}
            placeholder={"category"}
            enableModalBlur={false}
            onChange={(item: string) =>
              setItemInfo({ ...itemInfo, category: item })
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

          <MyTextField
            value={itemInfo.ingredients}
            placeholder="ingredients"
            multiline
            numberOfLines={5}
            setValue={(value: string) =>
              setItemInfo({ ...itemInfo, ingredients: value })
            }
            style={{
              ...styles.textField,
              minHeight: 100,
              textAlignVertical: "top",
              paddingTop: 5,
              paddingBottom: 5,
              marginTop: 20
            }}
          />

          <MyTextField
            value={itemInfo.description}
            placeholder="description"
            multiline
            numberOfLines={5}
            setValue={(value: string) =>
              setItemInfo({ ...itemInfo, description: value })
            }
            style={{
              ...styles.textField,
              minHeight: 100,
              textAlignVertical: "top",
              paddingTop: 5,
              paddingBottom: 5,
              marginTop: 49
            }}
          />
          {itemInfo.image ? (
            <Image
              source={{ uri: itemInfo.image.uri }}
              style={{ height: 200, width: 200, alignSelf: "flex-start" }}
            />
          ) : (
            <Entypo
              style={{ alignSelf: "flex-start",  marginTop:10  }}
              name="image"
              size={24}
              color="black"
            />
          )}
          <TouchableOpacity
            onPress={pickImage}
            style={{ alignSelf: "flex-start"}}
          >
            <Text text70 style={{ color: colors.link }}>
              Choose Image
            </Text>
          </TouchableOpacity>

          <Button
            label="Submit"
            disabled={disabled}
            onPress={handleSubmit}
            backgroundColor={colors.secondary}
            size="large"
            style={{ marginTop: 30, marginBottom: 30 }}
          />
        </View>
        <Toast />
      </ScrollView>
    </Modal>
  );
};

export default AddItemModal;
