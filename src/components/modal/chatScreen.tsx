// ChatScreen.js

import { useSocket } from "@/app/_layout";
import { useAuth } from "@/contexts/auth";
import usePushNotifications from "@/hooks/usePushNotifications";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  Avatar,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

const ChatScreen = ({
  isVisible,
  restaurantId,
  onClose,
  reciverId,
  name,
  customerId,
  profilePicture,
}) => {
  const { user } = useAuth();
  const { isConnected, socket } = useSocket()

  const [messages, setMessages] = useState([]);


  useEffect(() => {
    axios
      .get(process.env.EXPO_PUBLIC_API_URL + "/chats/chat-history", {
        params: {
          restaurantId,
          customerId,
        },
      })
      .then((res) => {
        setMessages(
          res.data.map((message) => ({
            _id: message._id,
            text: message.content,
            createdAt: new Date(message.timestamp),
            user: {
              _id: message.sender === "restaurant" ? restaurantId : customerId,
              avatar:
                message.sender === "restaurant"
                  ? profilePicture
                  : user.photoURL,
              name: message.sender === "restaurant" ? name : user.displayName,
            },
          }))
        );
      });
  }, [restaurantId]);

  useEffect(() => {
    if (isConnected && socket) {

      const handleGetMessage = (message) => {
        if (message.senderId === restaurantId) {
          setMessages((prevMessages) => {
            const newMessage = {
              _id: message._id || message.timestamp,
              text: message.content,
              createdAt: new Date(message.timestamp),
              user: {
                _id:
                  message.sender === "restaurant" ? restaurantId : customerId,
                name: message.sender === "restaurant" ? name : user.displayName,
                avatar:
                  message.sender === "restaurant"
                    ? profilePicture
                    : user.photoURL,
              },
            };

            return prevMessages
              ? GiftedChat.append(prevMessages, [newMessage])
              : [newMessage];
          });
        }
      };

      socket.on("getMessage", handleGetMessage);
      return () => {
        // Cleanup: Remove the event listener when component unmounts or when dependencies change
      };
    }
  }, [isConnected, customerId, restaurantId]);

  const onSend = useCallback(
    (messages = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
      if (isConnected) {
        socket.emit("chatMessage", {
          restaurantId,
          customerId,
          receiverId: reciverId,
          senderId: customerId,
          sender: "customer", // Assuming the customer is the sender
          content: messages[0].text,
        });
      } else {
        console.error("Socket is not connected");
      }
    },
    [restaurantId]
  );

  return (
    <Modal animationType="slide" visible={isVisible} onRequestClose={onClose}>
      {isConnected ? (
        <View style={styles.container}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="arrow-back" size={32} />
            </TouchableOpacity>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Avatar source={{ uri: profilePicture }} />
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>{name}</Text>
            </View>
          </View>
          <GiftedChat
            showUserAvatar
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: customerId,
              name: user.displayName,
              avatar: user.photoURL,
            }}
          />
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  closeButton: {
    alignSelf: "flex-start",
    padding: 5,
  },
  modalHeader: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    elevation: 4,
  },
});

export default ChatScreen;
