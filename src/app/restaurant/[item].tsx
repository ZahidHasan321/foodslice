import axios from "axios";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text } from "react-native-ui-lib";
const Buffer = require("buffer").Buffer;

const EditItem = () => {
  const [item, setItem] = useState(null);
  const query = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const cancelToken = axios.CancelToken.source();
      axios
        .get(process.env.EXPO_PUBLIC_API_URL + "/items/getItemById", {
          cancelToken: cancelToken.token,
          params: {
            id: query.item,
          },
        })
        .then((res) => {
          setItem(res.data);
          setIsLoading(false);
        });

      return () => {
        cancelToken.cancel();
      };
    }, [query.item])
  );

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {item?.img && (
        <Image
          source={{
            uri:
              "data:image/jpeg;base64," +
              Buffer(item.img.data.data).toString("base64"),
          }}
          style={{ height: responsiveHeight(30), width: responsiveWidth(100) }}
        />
      )}
      <Text text30>{item?.name}</Text>
    </SafeAreaView>
  );
};

export default EditItem;
