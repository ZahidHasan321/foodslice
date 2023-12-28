import ListItem from "@/components/card/ListItem";
import AddItemModal from "@/components/modal/addItemModal";
import { useAuth } from "@/contexts/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@shopify/restyle";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import SearchBar from "react-native-dynamic-search-bar";
import { RefreshControl } from "react-native-gesture-handler";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, View } from "react-native-ui-lib";

const Home = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [searchParam, setSearchParam] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {logOut} = useAuth()

  const handleFabButtonPress = () => {
    setModalVisibility(true);
  };

  const getItemsFromAPI = () => {
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
  };

  useEffect(() => {
    getItemsFromAPI();
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

  const handleModalVisibility = (value: boolean) => {
    setModalVisibility(value);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getItemsFromAPI();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderItem = (item) => {
    return <ListItem item={item.item} refreshPage={onRefresh} />;
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
      top: responsiveHeight(85),
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
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "row",
          gap: 10,
          marginRight: 36,
          marginLeft: 10,
        }}
      >
        <SearchBar
          style={{ height: 50, minWidth: 60 }}
          onChangeText={(params) => setSearchParam(params)}
        />
        <Avatar
          onPress={() => logOut()}
          animate
          source={{
            uri: "https://cdn.pixabay.com/photo/2018/08/28/13/29/avatar-3637561_1280.png",
          }}
          label="DP"
        />
      </View>
      <View marginT-20>
        <FlatList
          nestedScrollEnabled
          data={searchedData}
          renderItem={renderItem}
          contentContainerStyle={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 2,
            minHeight: responsiveHeight(100),
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>

      <AddItemModal
        getItems={onRefresh}
        modalVisibility={modalVisibility}
        handleModal={handleModalVisibility}
      />
      <Button style={styles.fab} round onPress={handleFabButtonPress}>
        <Ionicons name="add" size={30} />
      </Button>
    </SafeAreaView>
  );
};

export default Home;
