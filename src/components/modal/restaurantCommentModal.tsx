// ReviewModal.js

import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Modal, StyleSheet } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import {
  Avatar,
  Button,
  Card,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

const ShowAllRestaurantReviewModal = ({ isVisible, restaurantId, onClose }) => {
  const [data, setData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("recent");
  const naviation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      axios
        .get(
          process.env.EXPO_PUBLIC_API_URL +
            "/restaurantReviews/get-reviews-by-restaurant",
          {
            params: { restaurant: restaurantId },
          }
        )
        .then((res) => {
          setData(res.data);
        });
    }, [restaurantId])
  );

  const totalRating = data.reduce(
    (sum, review) => sum + review.overallRating,
    0
  );
  const numberOfPeopleRated = data.length;

  const averageRating = totalRating / numberOfPeopleRated;

  const totalServiceScore = data.reduce(
    (sum, review) => sum + review.criteria.service,
    0
  );
  const averageServiceScore = totalServiceScore / numberOfPeopleRated;

  const totalFoodQualityScore = data.reduce(
    (sum, review) => sum + review.criteria.foodQuality,
    0
  );
  const averageFoodQualityScore = totalFoodQualityScore / numberOfPeopleRated;

  const totalAmbianceScore = data.reduce(
    (sum, review) => sum + review.criteria.ambiance,
    0
  );
  const averageAmbianceScore = totalAmbianceScore / numberOfPeopleRated;

  const filteredAndSortedData = useMemo(() => {
    switch (selectedFilter) {
      case "recent":
        return [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case "Desc":
        return [...data].sort((a, b) => b.overallRating - a.overallRating);
      case "Asc":
        return [...data].sort((a, b) => a.overallRating - b.overallRating);
      default:
        return data;
    }
  }, [data, selectedFilter]);

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
            uri: item.profilePicture || "https://avatar.iran.liara.run/public/boy?username=Ash",
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
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity marginL-20 marginT-10 onPress={onClose}>
        <Ionicons name="arrow-back" size={30} />
      </TouchableOpacity>
      <View flex marginH-10 paddingV-20>
        <Card
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.39,
            shadowRadius: 8.3,

            elevation: 13,
            margin: 10,
            padding: 10,
            marginBottom: 20,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginLeft: 10 }}>
              {averageRating.toFixed(1)}
              <Text style={{ fontSize: 16, fontWeight: "400" }}>
                ({numberOfPeopleRated})
              </Text>
            </Text>
            <StarRatingDisplay rating={averageRating} starSize={20} />
          </View>

          <View>
            <Text style={{ fontWeight: "500", marginLeft: 10 }}>
              Food quality
            </Text>
            <StarRatingDisplay
              style={{ marginBottom: 10 }}
              rating={averageFoodQualityScore}
              starSize={18}
            />

            <Text style={{ fontWeight: "500", marginLeft: 10 }}>Service</Text>
            <StarRatingDisplay
              style={{ marginBottom: 10 }}
              rating={averageServiceScore}
              starSize={18}
            />

            <Text style={{ fontWeight: "500", marginLeft: 10 }}>Ambiance</Text>
            <StarRatingDisplay
              style={{ marginBottom: 10 }}
              rating={averageAmbianceScore}
              starSize={18}
            />
          </View>
        </Card>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            marginBottom: 10,
            marginLeft: 10,
          }}
        >
          Reviews
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 10, marginLeft:10 }}>
          <Button
            size="small"
            label="Most Recent"
            onPress={() => setSelectedFilter("Recent")}
          />

          {selectedFilter === "Asc" ? (
            <Button
              label="High to Low"
              onPress={() => setSelectedFilter("Desc")}
            />
          ) : (
            <Button
              label="Low to High"
              onPress={() => setSelectedFilter("Asc")}
            />
          )}
        </View>
        <FlatList
          data={filteredAndSortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    </Modal>
  );
};

export default ShowAllRestaurantReviewModal;
