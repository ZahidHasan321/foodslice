import ChatScreenRestaurant from "@/components/modal/chatScreenRestaurant";
import usePushNotifications from "@/hooks/usePushNotifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from 'expo-constants';
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Card, Text, View } from "react-native-ui-lib";
import { io } from "socket.io-client";


const ChatList = () => {
  const [restaurantId, setRestaurantId] = useState(null);
  const socket = io(process.env.EXPO_PUBLIC_API_URL);
  const [chatList, setChatList] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [showChatScreen, setShowChatScreen] = useState(false);
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  //notification
  const { schedulePushNotification } = usePushNotifications();

  const getStorageData = async () => {
    const value = await AsyncStorage.getItem("my-restaurant-id");
    setRestaurantId(value);
  };

  useEffect(() => {
    getStorageData();

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const getChatHistory = () => {
    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/chats/get-chat-list", {
        params: {
          restaurantId,
        },
      })
      .then((res) => {
        const chatMap = new Map(Object.entries(res.data));
        setChatList(chatMap);
      });
  };

  useEffect(() => {
    if (restaurantId) {
      getChatHistory();
    }
  }, [restaurantId]);

  useEffect(() => {
    if (isConnected && restaurantId) {
      socket.emit("joinChat", {
        senderId: restaurantId,
      });

      socket.on("getMessage", (message) => {
        // if (chat && message.senderId === chat.customer._id) {
        //   chat.messages.unshift({
        //     sender: message.sender,
        //     content: message.content,
        //     timestamp: message.timestamp,
        //   });
        // }

  

        setNewMessage(message);
        
        setChatList((prevMap) => {
          const updatedMap = new Map(prevMap);

          if (updatedMap.has(message.senderId)) {
            const chat = updatedMap.get(message.senderId);

            updatedMap.delete(message.senderId);

            // Update the existing chat by adding a new message
            const updatedChat = {
              ...(chat as { messages: any[] }),
              messages: [
                {
                  sender: message.sender,
                  content: message.content,
                  timestamp: message.timestamp,
                },
                ...(chat as { messages: any[] }).messages,
              ],
            };

            const newMap = new Map([
              [message.senderId, updatedChat],
              ...updatedMap,
            ]);

            schedulePushNotification((chat as any).customer.username, message.content);

            return newMap;
          } else {
            // If senderId is not found, create a new object
            getChatHistory();
          }

          return updatedMap;
        });
      });
    }

    return () => {
      socket.off("getMessage");
    };
  }, [isConnected, socket, restaurantId]);

  //handle my messages, and update chatList
  const updateMyMessage = (message, customerId) => {
    setChatList((prevMap) => {
      const updatedMap = new Map(prevMap);

      if (updatedMap.has(customerId)) {
        // Delete the existing entry
        const chat = updatedMap.get(customerId);
        updatedMap.delete(customerId);

        // Update the existing chat by adding a new message
        const updatedChat = {
          ...(chat as { messages: any[] }),
          messages: [
            {
              sender: "restaurant",
              content: message,
              timestamp: new Date(),
            },
            ...(chat as { messages: any[] }).messages,
          ],
        };

        // Create a new Map and insert the updated entry at the front
        const newMap = new Map([[customerId, updatedChat], ...updatedMap]);

        return newMap;
      }

      return updatedMap;
    });
  };

  const Chat = ({ chat }) => {
    const handleCardPress = () => {
      setShowChatScreen(true);
      setChat(chat);
    };

    return (
      <Card
        onPress={handleCardPress}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: 60,
          gap: 10,
          borderRadius: 10,
          marginHorizontal: 10,
        }}
      >
        <Card.Image
          source={{ uri: chat.customer.profilePicture }}
          style={{
            height: 50,
            width: 50,
            marginLeft: 6,
            borderRadius: 30,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        />
        <View
          style={{
            alignSelf: "flex-start",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontWeight: "500",
              fontSize: responsiveFontSize(2),
            }}
          >
            {chat.customer?.username}
          </Text>
          <Text>{chat?.messages[0]?.content}</Text>
        </View>
      </Card>
    );
  };

  return (
    <ScrollView style={{ marginTop: 10 }}>
      {chatList &&
        Array.from(chatList.values()).map((chat, idx) => {
          return <Chat key={idx} chat={chat} />;
        })}

      {chat && (
        <ChatScreenRestaurant
          isVisible={showChatScreen}
          onClose={() => setShowChatScreen(false)}
          restaurantId={restaurantId}
          socket={socket}
          newMessage={newMessage}
          chat={chat}
          isConnected={isConnected}
          updateMyMessage={updateMyMessage}
          setMessageToEmpty={() => {
            setNewMessage(null);
          }}
        />
      )}
    </ScrollView>
  );
};

export default ChatList;
