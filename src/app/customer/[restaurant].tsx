React;
import ChatScreen from "@/components/modal/chatScreen";
import ShowAllRestaurantReviewModal from "@/components/modal/restaurantCommentModal";
import RestaurantMoreInfoModal from "@/components/modal/restaurantMoreInfoModal";
import ReviewModal from "@/components/modal/restaurantReviewModal";
import { useAuth } from "@/contexts/auth";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import axios from "axios";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import Toast from "react-native-toast-message";

import {
  Avatar,
  Card,
  LoaderScreen,
  TabController,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

const DynamicRestaurantPage = () => {
  const restaurantId = useLocalSearchParams();
  const [items, setItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [myReview, setMyReview] = useState(null);
  const [openWriteAReview, setOpenWriteAReviw] = useState(false);
  const [openShowAllReviews, setShowAllReviews] = useState(false);
  const [showRestaurantMoreInfoModal, setShowRestaurantMoreInfoModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [openChatModal, setOpenChatModal] = useState(false);
  const [userId, setUserId] = useState(null);

  const navigation = useNavigation();
  const { colors } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const source = axios.CancelToken.source();
        const res = await axios.get(
          process.env.EXPO_PUBLIC_API_URL + "/items/get-items-by-restaurant",
          {
            params: {
              restaurant: restaurantId,
              user: user.uid,
            },
            cancelToken: source.token,
          }
        );
        // Handle the response
        setItems(res.data.items);
        setRestaurant(res.data.restaurant);
        setMyReview(res.data.myReview);
        setUserId(res.data.user._id);

        axios
          .get("https://api.bigdatacloud.net/data/reverse-geocode-client", {
            params: {
              latitude: res.data.restaurant.location.coordinate.latitude,
              longitude: res.data.restaurant.location.coordinate.longitude,
            },
          })
          .then((res) => setLocation(res.data));
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false); // Set loading to false after data fetching, whether successful or not
      }
    };

    fetchData();

    const unsubscribeFocus = navigation.addListener("focus", () => {
      // Fetch data again when the screen comes into focus
      setLoading(true); // Set loading to true when fetching data
      fetchData();
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      // Set loading to false when the screen is blurred (user goes back)
      setLoading(false);
    });

    return () => {
      // Cleanup subscriptions when the component unmounts
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [restaurantId, navigation]);

  const handleReviewSubmit = ({ comment, criteria }) => {
    axios
      .post(
        process.env.EXPO_PUBLIC_API_URL + "/restaurantReviews/post-review",
        {
          comment,
          criteria,
          user: user.uid,
          restaurant: restaurantId.restaurantId,
        }
      )
      .then((res) => {
        Toast.show({
          type: "success",
          text1: "Review submitted",
        });
      });
  };

  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  };

  const groupedItems = groupByCategory(items);

  const categoryList = Object.keys(groupedItems).map((category) => ({
    label: category,
  }));

  const handleMoreInfoBTN = () => {
    setShowRestaurantMoreInfoModal(true);
  };

  const renderTabPage = (category) => {
    // Filter items based on the current category
    const filteredItems = items.filter((item) => item.category === category);

    return (
      <View flex>
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card
              key={item._id}
              flex
              center
              onPress={() => console.log("pressed")}
              style={{ margin: 10, borderRadius: 8, overflow: "hidden" }}
            >
              <Card.Image
                source={{ uri: item.image }}
                style={{ height: 150, width: "100%" }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: "white",
                  padding: 5,
                  borderRadius: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: item.available ? "green" : "red",
                    marginRight: 5,
                  }}
                />
                <Text style={{ color: item.available ? "green" : "red" }}>
                  {item.available ? "Available" : "Unavailable"}
                </Text>
              </View>
              <View
                style={{ display: "flex", alignSelf: "flex-start", margin: 8 }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}
                >
                  {item.name}
                </Text>
                <Text>{item.description}</Text>
                <Text style={{ color: "green", marginTop: 5 }}>
                  {`Price: $${item.price}`}
                </Text>
              </View>
            </Card>
          )}
        />
      </View>
    );
  };

  if (loading) {
    return <LoaderScreen message="Loading" />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        marginL-20
        marginT-10
        onPress={() => navigation.goBack()}
      >
        <Ionicons size={32} name="arrow-back" />
      </TouchableOpacity>
      <View marginH-20 style={{ height: "auto", margin: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
          {restaurant?.name}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <View>
            <Text>{location?.locality}</Text>
            <Text style={{ fontSize: 14, fontWeight: "400" }}>
              <Text style={{ fontWeight: "500" }}>Additional info:</Text>{" "}
              {restaurant?.additionalLocationInfo}
            </Text>
          </View>
          <TouchableOpacity onPress={handleMoreInfoBTN}>
            <Text style={{ fontWeight: "bold", color: colors.link }}>
              More info
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: myReview ? null : "auto",
          }}
        >
          {myReview && (
            <Card style={{ padding: 4 }}>
              <Avatar
                source={{
                  uri:
                    user.photoURL ||
                    "https://avatar.iran.liara.run/public/boy?username=Ash",
                }}
                containerStyle={{ marginBottom: 6 }}
              />
              <StarRatingDisplay rating={myReview.overallRating} />
              <Text style={{ marginLeft: 10, fontSize: 14 }}>
                {myReview.comment}
              </Text>
            </Card>
          )}
          <TouchableOpacity onPress={() => setOpenWriteAReviw(true)}>
            <Text style={{ fontWeight: "bold", color: colors.link }}>
              Write a review
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              <Text style={{ fontWeight: "bold" }}>Rating: </Text>
              {restaurant?.averageRating.toFixed(1)}
              <Text style={{ fontSize: 14, fontWeight: "400" }}>
                ({restaurant.reviews.length})
              </Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowAllReviews(true)}>
            <Text
              style={{
                fontWeight: "bold",
                color: colors.link,
                marginLeft: "auto",
              }}
            >
              See reviews
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {items.length > 0 ? (
        items.length > 1 ? ( // Render TabController for multiple categories
          <TabController items={categoryList}>
            <TabController.TabBar />

            <View flex>
              {Object.keys(groupedItems).map((category, index) => (
                <TabController.TabPage key={index} index={index} lazy>
                  {renderTabPage(category)}
                </TabController.TabPage>
              ))}
            </View>
          </TabController>
        ) : (
          // Render content for a single category
          <View flex>{renderTabPage(items[0].category)}</View>
        )
      ) : (
        // Render placeholder or loading state when items are empty
        <Text>No item found</Text>
      )}



      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          backgroundColor: "#007AFF", // Your desired background color
          borderRadius: 50, // Make it round
          padding: 16,
          elevation: 12,
          zIndex: 10,
        }}
        onPress={() => {
          setOpenChatModal(true);
        }}
      >
        <Ionicons name="chatbox" size={32} color="white" />
      </TouchableOpacity>

      <ChatScreen
        isVisible={openChatModal}
        onClose={() => {
          setOpenChatModal(false);
        }}
        restaurantId={restaurant._id}
        reciverId={restaurant?.owner?.uid}
        name={restaurant.name}
        profilePicture={restaurant.coverImage}
        customerId={userId}
      />
      <ReviewModal
        isVisible={openWriteAReview}
        onClose={() => setOpenWriteAReviw(false)}
        onSubmit={handleReviewSubmit}
      />
      <ShowAllRestaurantReviewModal
        isVisible={openShowAllReviews}
        onClose={() => setShowAllReviews(false)}
        restaurantId={restaurantId.restaurantId}
      />

      <RestaurantMoreInfoModal
        isVisible={showRestaurantMoreInfoModal}
        onClose={() => setShowRestaurantMoreInfoModal(false)}
        restaurant={restaurant}
      />
    </SafeAreaView>
  );
};

export default DynamicRestaurantPage;
