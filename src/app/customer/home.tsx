import { useAuth } from "@/contexts/auth";
import axios from "axios";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, View } from "react-native";
import { Card, Text, TouchableOpacity } from "react-native-ui-lib";
import Toast from "react-native-toast-message";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import haversineDistance from "@/utils/haversineFormula";
import { useTheme } from "@shopify/restyle";

const Home = () => {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  const getRestaurantData = async () => {
    try {
      const response = await axios.get(
        process.env.EXPO_PUBLIC_API_URL + "/restaurants/get-top-restaurants"
      );
      setAllRestaurants(response.data);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permission to access location was denied",
        });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    } catch (error) {
      console.error("Error getting user location:", error);
    }
  };

  const handleRestaurantCardPress = (name, restaurantId) => {
    router.push({ pathname: `/customer/${name}`, params: { restaurantId } });
  };

  const onRefresh = () => {
    setRefreshing(true);
    getRestaurantData();

    setTimeout(()=>{
      setRefreshing(false);
    },2000)
  };

  useEffect(() => {
    getRestaurantData();
  }, []);

  useEffect(() => {
    getLocation();
  }, []);

  const nearbyRestaurants = allRestaurants.filter((restaurant) => {
    if (userLocation) {
      const distance = haversineDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        restaurant.location.coordinate.latitude,
        restaurant.location.coordinate.longitude
      );
      return distance <= 10; // Filter restaurants within 10km
    }
    return false;
  });

  // Group restaurants by type
  const groupedRestaurants = {};
  allRestaurants.forEach((restaurant) => {
    const type = restaurant.type;
    if (!groupedRestaurants[type]) {
      groupedRestaurants[type] = [];
    }
    groupedRestaurants[type].push(restaurant);
  });

  const renderRestaurantGroup = ({ item }) => {
    return (
      <View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.type}</Text>
          <Link href={{ pathname: "/customer/types/[type]", params: { type: item.type } }} asChild>
            {item.type !== 'Nearby' ? 
              <TouchableOpacity>
                <Text style={{ fontSize: responsiveFontSize(1.8), fontWeight: "bold", color: colors.link }}>See more</Text>
              </TouchableOpacity> 
              : null}
          </Link>
        </View>
        <FlatList
          horizontal
          data={item.restaurants}
          keyExtractor={(restaurant) => restaurant._id}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: restaurant }) => (
            <Card
              key={restaurant._id}
              style={{ width: 200, margin: 10 }}
              onPress={() =>
                handleRestaurantCardPress(restaurant.name, restaurant._id)
              }
            >
              <Card.Image
                source={{ uri: restaurant.coverImage }}
                style={{ height: 100, width: "auto" }}
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
                <Ionicons name="star" size={14} /> {restaurant?.averageRating?.toFixed(1) || 0}{" "}
                <Text style={{ fontWeight: "300" }}>
                  ({restaurant?.numberOfReviews})
                </Text>
              </Text>
            </Card>
          )}
        />
      </View>
    );
  };

  const flatListData = [
    ...(userLocation && nearbyRestaurants.length > 0 ? [{ type: "Nearby", restaurants: nearbyRestaurants }] : []),
    ...Object.entries(groupedRestaurants).map(([type, restaurants]) => ({ type, restaurants })),
  ];

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 10 }}>
      <FlatList
        data={flatListData}
        keyExtractor={(item) => item.type}
        renderItem={renderRestaurantGroup}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default Home;
