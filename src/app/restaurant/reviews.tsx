import { useAuth } from "@/contexts/auth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { Avatar, Card } from "react-native-ui-lib";
import { StarRatingDisplay } from "react-native-star-rating-widget";

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const getReviewsData = () => {
    axios
      .get(
        process.env.EXPO_PUBLIC_API_URL +
          "/restaurantReviews/get-reviews-of-restaurant",
        {
          params: {
            id: user?.uid,
          },
        }
      )
      .then((res) => {
        setReviews(res.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    getReviewsData();
  };

  useEffect(() => {
    getReviewsData();
  }, []);

  const renderItem = ({ item, index }) => (
    <Card
      key={index}
      marginB-20
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.3,
        elevation: 13,
        padding: 10,
        margin: 10,
      }}
    >
      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <Avatar
          source={{
            uri: item?.user?.profilePicture || "https://avatar.iran.liara.run/public/boy?username=Ash",
          }}
        />
        <View>
          <Text
            style={{ alignSelf: "center", fontSize: 16, fontWeight: "bold" }}
          >
            {item.user?.username}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: "500" }}>
            {new Date(item?.date).toLocaleDateString("en-GB")}
          </Text>
        </View>
      </View>
      <StarRatingDisplay
        rating={item.overallRating}
        starSize={20}
        style={{ marginLeft: -4, marginBottom: 12 }}
      />
      <Text style={{ fontWeight: "500" }}>{item?.comment}</Text>
    </Card>
  );

  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No reviews found</Text>
        </View>
      }
    />
  );
};

export default Reviews;
