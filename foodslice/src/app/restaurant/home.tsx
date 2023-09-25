import MyTextField from "@/components/textfield/customTextfield";
import { useAuth } from "@/contexts/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@shopify/restyle";
import axios from "axios";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Card,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

type ItemProps = {
  name: string;
  price: Number;
  description: String;
  category: String;
  ingrediants: String;
};

// const Item = ({
//   name,
//   ingrediants,
//   price,
//   description,
//   category,
// }: ItemProps) => (
//   <View style={{ height: 60, width: "100%" }}>
//     <Text>{name}</Text>
//   </View>
// );

const Item = ({ item, onPress }) => (
  <Card>
    <TouchableOpacity
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        width: responsiveWidth(100),
        borderRadious: 2,
        borderWidth: 0,
        padding: 20,
      }}
    >
      <Text>{item.name}</Text>
      <Text>{item.price}</Text>
    </TouchableOpacity>
  </Card>
);

const renderItem = (item) => {
  const backgroundColor = "#6e3b6e";
  console.log(item.item);
  return <Item item={item.item} onPress={() => {}} />;
};

const Home = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [modalVisibility, setModalVisibility] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [itemInfo, setItemInfo] = useState({
    name: "",
    ingradients: "",
    description: "",
    price: "",
    category: "",
  });

  const handleFabButtonPress = () => {
    setModalVisibility(true);
  };

  useEffect(() => {
    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/users/getUser", {
        params: {
          uid: user.uid,
        },
      })
      .then((userInfo) => {
        axios
          .get(
            process.env.EXPO_PUBLIC_API_URL +
              "/restaurants/getRestaurantByUser",
            {
              params: {
                owner: userInfo.data._id,
              },
            }
          )
          .then((res) => {
            axios
              .get(
                process.env.EXPO_PUBLIC_API_URL + "/items/getItemByRestaurant",
                {
                  params: {
                    id: res.data._id,
                  },
                }
              )
              .then((res) => setItemList(res.data))
              .catch((e) => console.error(e));
          });
      });
  }, [modalVisibility]);

  const handleSubmit = () => {
    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/users/getUser", {
        params: {
          uid: user.uid,
        },
      })
      .then((userInfo) => {
        axios
          .get(
            process.env.EXPO_PUBLIC_API_URL +
              "/restaurants/getRestaurantByUser",
            {
              params: {
                owner: userInfo.data._id,
              },
            }
          )
          .then((res) => {
            axios
              .post(process.env.EXPO_PUBLIC_API_URL + "/items", {
                ...itemInfo,
                restaurant: res.data._id,
                price: parseInt(itemInfo.price),
              })
              .then(() => setModalVisibility(!modalVisibility))
              .catch((e) => console.error(e));
          });
          
      });
  };

  const styles = StyleSheet.create({
    fab: {
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.2)",
      alignItems: "center",
      justifyContent: "center",
      width: 70,
      position: "absolute",
      bottom: 0,
      top: responsiveHeight(80),
      right: 10,
      height: 70,
      backgroundColor: "#fff",
      borderRadius: 100,
      elevation: 8,
    },
    textField: {
      width: responsiveWidth(80),
      marginBottom: 20,
    },
  });
  return (
    <SafeAreaView>
      <View marginT-20>
        <FlatList
          data={itemList}
          renderItem={renderItem}
          contentContainerStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            width: "100%",
            gap: 2,
          }}
        />

        <Button style={styles.fab} round onPress={handleFabButtonPress}>
          <Ionicons name="add" size={30} />
        </Button>
      </View>

      <Modal
        visible={modalVisibility}
        onRequestClose={() => setModalVisibility(false)}
        animationType="slide"
      >
        <TouchableOpacity onPress={() => setModalVisibility(!modalVisibility)}>
          <Text
            red20
            style={{ marginLeft: "auto", marginRight: 10, fontSize: 20 }}
          >
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
            value={itemInfo.ingradients}
            placeholder="ingradients"
            setValue={(value: string) =>
              setItemInfo({ ...itemInfo, ingradients: value })
            }
            style={styles.textField}
          />

          <MyTextField
            value={itemInfo.price}
            placeholder="price"
            keyboardType="numeric"
            setValue={(value: string) =>
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

          <Button
            label="Submit"
            onPress={handleSubmit}
            backgroundColor={colors.secondary}
            size="large"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;
