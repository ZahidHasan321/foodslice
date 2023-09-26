import MyTextField from "@/components/textfield/customTextfield";
import { useAuth } from "@/contexts/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@shopify/restyle";
import axios from "axios";
import { Tabs } from "expo-router";
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
import SearchBar from "react-native-dynamic-search-bar";

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
  <Card
    style={{
      width: responsiveWidth(100),
      borderRadious: 2,
      borderWidth: 0,
      padding: 20,
    }}
  >
    <TouchableOpacity
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text>{item.name}</Text>
        <Text>
          {"\u0024"}
          {item.price}
        </Text>
      </View>
      <Text>{item.description}</Text>
    </TouchableOpacity>
  </Card>
);

const renderItem = (item) => {
  const backgroundColor = "#6e3b6e";
  return <Item item={item.item} onPress={() => {}} />;
};

const Home = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [searchParam, setSearchParam] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [itemInfo, setItemInfo] = useState({
    name: "",
    ingradients: "",
    description: "",
    price: "",
    category: "",
  });
  const [searchedData, setSearchedData] = useState([]);

  const handleFabButtonPress = () => {
    setModalVisibility(true);
  };

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/items/getItems", {
        cancelToken: cancelToken.token,
        params: {
          id: user.uid,
        },
      })
      .then((res) => {
        setItemList(res.data);
        setSearchedData(res.data);
      })
      .catch((e) => console.log(e));

    return () => {
      cancelToken.cancel();
    };
  }, []);

  useEffect(() => {
    if (searchParam !== "") {
      const filteredData = searchedData.filter((item) => {
        return item.name.toLowerCase().includes(searchParam.toLowerCase())
          ? item
          : null;
      });
      setSearchedData(filteredData);
    } else {
      setSearchedData(itemList);
    }
  }, [searchParam]);

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
      top: responsiveHeight(70),
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
      <Tabs.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={{ marginTop: 10 }}>
        <SearchBar
          style={{height:50}}
          onChangeText={(params) => setSearchParam(params.trim())}
        />
      </View>
      <View marginT-20>
        <FlatList
          data={searchedData}
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
          {/* <Text
            red20
            style={{ marginLeft: "auto", marginRight: 10, fontSize: 20 }}
          >
            Close
          </Text> */}
          <Ionicons name="close" size={30} color={'red'} style={{ marginLeft: "auto", marginRight: 10, marginTop:5}}/>
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
