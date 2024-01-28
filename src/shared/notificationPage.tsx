import { useAuth } from "@/contexts/auth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Text, View } from "react-native-ui-lib";

const Notifications = () => {
  const [notifications, setNotifications] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const getNotificationData = () => {
    axios
      .get(
        process.env.EXPO_PUBLIC_API_URL +
          "/notifications/get-all-notifications",
        {
          params: {
            recipient: user?.uid,
          },
        }
      )
      .then((res) => {
        setNotifications(res.data);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    getNotificationData();
  };

  useEffect(() => {
    getNotificationData();
  }, []);

  const NotificationCard = ({ item }) => {
    const date = new Date(item.createdAt);
    const currentDate = new Date();

    const timeDifference = currentDate.getTime() - date.getTime();

    // Convert time difference to seconds
    const timeDifferenceInSeconds = timeDifference / 1000;

    let formattedTimeDifference;

    if (timeDifferenceInSeconds < 60) {
      formattedTimeDifference = `${Math.floor(timeDifferenceInSeconds)} seconds ago`;
    } else if (timeDifferenceInSeconds < 3600) {
      formattedTimeDifference = `${Math.floor(timeDifferenceInSeconds / 60)} minutes ago`;
    } else if (timeDifferenceInSeconds < 86400) {
      formattedTimeDifference = `${Math.floor(timeDifferenceInSeconds / 3600)} hours ago`;
    } else {
      formattedTimeDifference = `${Math.floor(timeDifferenceInSeconds / 86400)} days ago`;
    }
    return (
      <Card style={{ marginTop: 10, marginHorizontal: 8, padding: 10 }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight:'bold'}}>{item.message}</Text>
          <Text style={{fontSize:14, fontWeight: '400'}}>{formattedTimeDifference}</Text>
        </View>
      </Card>
    );
  };

  return (
    
    <FlatList
      data={notifications}
      keyExtractor={(notification) => notification._id}
      renderItem={NotificationCard}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>No notifications found</Text>
        </View>
      }
    />
  );
};

export default Notifications;
