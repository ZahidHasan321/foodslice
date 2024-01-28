import { useAuth } from "@/contexts/auth";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  Avatar,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

const ChatScreenRestaurant = ({
  chat,
  isVisible,
  onClose,
  restaurantId,
  socket,
  isConnected,
  newMessage,
  updateMyMessage,
  setMessageToEmpty
}) => {
  const [messages, setMessages] = useState(null);
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      setMessages(
        chat.messages.map((message) => ({
          _id: message?._id || message.timestamp,
          text: message.content,
          createdAt: new Date(message.timestamp),
          user: {
            _id:
              message.sender === "restaurant"
                ? restaurantId
                : chat.customer?._id,
            name:
              message.sender === "restaurant"
                ? chat.restaurant?.name
                : chat.customer?.username,
            avatar:
              message.sender === "restaurant"
                ? chat.restaurant?.coverImage
                : chat.customer?.profilePicture,
          },
        }))
      );
      return () => {
        setMessages(null);
      };
    }, [chat.customer?._id])
  );

  const UpdateChat = (message) => {
    setMessages((prevMessages) => {
      const newMessage = {
        _id: message._id || message.timestamp,
        text: message.content,
        createdAt: new Date(message.timestamp),
        user: {
          _id:
            message.sender === "restaurant" ? restaurantId : chat.customer?._id,
          name:
            message.sender === "restaurant"
              ? chat.restaurant?.name
              : chat.customer?.username,
          avatar:
            message.sender === "restaurant"
              ? chat.restaurant?.coverImage
              : chat.customer?.profilePicture,
        },
      };

  
      return prevMessages
        ? GiftedChat.append(prevMessages, [newMessage])
        : [newMessage];
    });
  };

  useEffect(() => {
    if (newMessage && newMessage?.senderId === chat.customer?._id) {
      UpdateChat(newMessage);
    }

    return () => {
      setMessageToEmpty();
    }
  }, [newMessage?.timestamp]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    updateMyMessage(messages[0].text, chat.customer._id);


    if (isConnected) {
      socket.emit("chatMessage", {
        restaurantId,
        customerId: chat.customer._id,
        receiverId: chat.customer.uid,
        sender: "restaurant", // Assuming the restaurant is the sender
        content: messages[0].text,
        senderId: restaurantId
      });

      
    } else {
      console.error("Socket is not connected");
    }
  }, [chat.customer?._id]);

  return (
    <Modal animationType="slide" visible={isVisible} onRequestClose={onClose}>
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
            <Avatar source={{ uri: chat.customer.profilePicture }} />
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {chat.customer.username}
            </Text>
          </View>
        </View>
        <GiftedChat
          showUserAvatar
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: restaurantId,
            name: user.displayName,
            avatar: chat.restaurant?.coverImage,
          }}
        />
      </View>
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

export default ChatScreenRestaurant;
