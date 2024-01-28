import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { Tabs, router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, LoaderScreen, Text } from "react-native-ui-lib";

const ItemsOfType = () => {
  const { type } = useLocalSearchParams();
  const [restaurants, setRestaurants] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const handleRestaurantCardPress = (name, restaurantId) => {
    router.push({ pathname: `/customer/${name}`, params: { restaurantId } });
  };

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();

      axios
        .get(
          process.env.EXPO_PUBLIC_API_URL +
            "/restaurants/get-restaurant-by-type",
          {
            params: {
              type: type,
            },
          }
        )
        .then((res) => {
          setRestaurants(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });


    return () => {
      cancelTokenSource.cancel();
      setRestaurants(null);
      setLoading(true);
    };
  }, [type, navigation]);

  if (loading) {
    return <LoaderScreen message="Loading" />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <Tabs.Screen options={{
            headerShown:true,
            title: type as any,
            headerTitleStyle: {
                fontWeight: 'bold',
              },
            headerLeft: () => {
                return(
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={32} />
                  </TouchableOpacity>
                )
            }
        }}/>
      <FlatList
        data={restaurants}
        keyExtractor={(restaurant) => restaurant._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ display: "flex", alignItems: "center" }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: restaurant }) => (
          <Card
            key={restaurant._id}
            style={{ width: responsiveWidth(85), margin: 10 }}
            onPress={() => {
              handleRestaurantCardPress(restaurant.name, restaurant._id)
            }}
          >
            <Card.Image
              source={{ uri: restaurant.coverImage }}
              style={{ height: 120, width: "auto" }}
            />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>
              {restaurant.name}
            </Text>
            <Text
              style={{
                marginLeft: "auto",
                fontWeight: "500",
                marginRight: 10,
                marginBottom: 4,
              }}
            >
              <Ionicons name="star" size={14} />{" "}
              {restaurant?.averageRating?.toFixed(1) || 0}{" "}
              <Text style={{ fontWeight: "300" }}>
                ({restaurant?.numberOfReviews})
              </Text>
            </Text>
          </Card>
        )}
      />
    </SafeAreaView>
  );
};

export default ItemsOfType;
