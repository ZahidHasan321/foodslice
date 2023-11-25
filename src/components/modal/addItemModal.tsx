import MyTextField from "@/components/textfield/customTextfield";
import { useAuth } from "@/contexts/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@shopify/restyle";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { responsiveWidth } from "react-native-responsive-dimensions";
import mime from "mime";
import {
  Button,
  Image,
  Incubator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { Entypo } from "@expo/vector-icons";
import { Toast } from "react-native-ui-lib/src/incubator";

interface Props {
  handleModal: (value: boolean) => void;
  modalVisibility: boolean;
  getItems: () => void;
}

const AddItemModal = ({ handleModal, modalVisibility, getItems }: Props) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [itemInfo, setItemInfo] = useState({
    name: "",
    ingredients: "",
    description: "",
    price: null,
    category: "",
    image: null,
  });
  const [isSuccess, setIsSuccess] = useState({
    value: false,
    message: "",
  });

  const [isError, setIsError] = useState({
    value: false,
    message: "",
  });

  const clearState = () => {
    setIsSuccess({ value: false, message: "" });
    setIsError({ value: false, message: "" });
  };

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
  const createFormData = (uri) => {
    const fileName = uri.split("/").pop();
    const fileType = fileName.split(".").pop();
    const newImageUri = "file:///" + uri.split("file:/").join("");

    const formData = new FormData();

    formData.append("image", {
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split("/").pop(),
    } as any);

    Object.entries(itemInfo).forEach(([key, value]) => {
      if (key !== "image") formData.append(key, value);
    });

    return formData;
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setItemInfo({ ...itemInfo, image: result.assets[0] });
    }
  };

  const handleModelState = () => {
    handleModal(false)
    clearState();
  }

  const handleSubmit = () => {
    if (
      itemInfo.name.trim() == "" ||
      itemInfo.price === null ||
      itemInfo.category.trim() == "" ||
      itemInfo.image === null ||
      itemInfo.ingredients.trim() == ""
    ) {
      setIsError({ value: true, message: "Field cannot be empty" });
    } else {
      const data = createFormData(itemInfo.image.uri);
      axios
        .get(process.env.EXPO_PUBLIC_API_URL + "/users/getUser", {
          params: {
            uid: user.uid,
          },
        })
        .then((userInfo) => {
          data.append("restaurant", userInfo.data._id);
          axios
            .post(process.env.EXPO_PUBLIC_API_URL + "/items", data, {
              headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              res.data.value
                ? (setIsSuccess(res.data), clearForm(), getItems())
                : setIsError(res.data);
            })
            .catch((e) => console.error(e));
        });
    }
  };

  const styles = StyleSheet.create({
    textField: {
      width: responsiveWidth(80),
      marginBottom: 20,
    },
  });
  return (
    <Modal
      visible={modalVisibility}
      onRequestClose={handleModelState}
      animationType="slide"
    >
      <ScrollView
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
          <Text text50 marginR-10>
            Close
          </Text>
        </TouchableOpacity>
        <View flex centerH>
          <Text text30 marginB-20>
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

          <MyTextField
            value={itemInfo.category}
            placeholder="category"
            setValue={(value: string) =>
              setItemInfo({ ...itemInfo, category: value })
            }
            style={styles.textField}
          />

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
              height: 100,
              textAlignVertical: "top",
              paddingTop: 5,
              paddingBottom: 5,
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
              height: 100,
              textAlignVertical: "top",
              paddingTop: 5,
              paddingBottom: 5,
            }}
          />
          {itemInfo.image ? (
            <Image
              source={{ uri: itemInfo.image.uri }}
              style={{ height: 200, width: 200, alignSelf: "flex-start" }}
            />
          ) : (
            <Entypo
              style={{ alignSelf: "flex-start" }}
              name="image"
              size={24}
              color="black"
            />
          )}
          <TouchableOpacity
            onPress={pickImage}
            style={{ alignSelf: "flex-start" }}
          >
            <Text text70 style={{ color: colors.link }}>
              Choose Image
            </Text>
          </TouchableOpacity>

          <Button
            label="Submit"
            onPress={handleSubmit}
            backgroundColor={colors.secondary}
            size="large"
            style={{ marginTop: 30, marginBottom: 30 }}
          />
        </View>
      </ScrollView>
      <Toast
        message={isSuccess.value ? isSuccess.message : ""}
        visible={isSuccess.value ? true : false}
        position="top"
        swipeable={true}
        autoDismiss={2000}
        onDismiss={() => clearState()}
        zIndex={10}
        preset={
          isSuccess.value
            ? Incubator.ToastPresets.SUCCESS
            : Incubator.ToastPresets.FAILURE
        }
        containerStyle={{ top: 0 }}
        centerMessage
      />

      <Toast
        message={isError.value ? isError.message : ""}
        visible={isError.value ? true : false}
        position="top"
        swipeable={true}
        autoDismiss={2000}
        zIndex={2}
        onDismiss={() => clearState()}
        preset={
          isError.value
            ? Incubator.ToastPresets.FAILURE
            : Incubator.ToastPresets.SUCCESS
        }
        containerStyle={{ top: 0 }}
        centerMessage
      />
    </Modal>
  );
};

export default AddItemModal;
