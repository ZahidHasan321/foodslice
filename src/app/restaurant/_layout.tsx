import { useAuth } from "@/contexts/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { Avatar } from "react-native-ui-lib/src/components/avatar";

export default function AppLayout() {
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [search, setSearch] = useState("");

  const { user, logOut } = useAuth();
  useEffect(() => {}, [search]);

  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <Menu>
            <MenuTrigger
              children={
                <Avatar
                  animate
                  source={{
                    uri:
                      user.photoURL ||
                      "https://cdn.pixabay.com/photo/2018/08/28/13/29/avatar-3637561_1280.png",
                  }}
                />
              }
            />
            <MenuOptions optionsContainerStyle={{ width: "auto" }}>
              <MenuOption>
                <Text
                  onPress={() => logOut()}
                  style={{ marginLeft: 10, height: 24, fontSize: 16 }}
                >
                  Logout
                </Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        ),
      }}
    >
      

      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: () => <Ionicons name="home" size={24} />,
        }}
      />
      <Tabs.Screen
        name="reviews"
        options={{
          tabBarIcon: () => <Ionicons name="star" size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: () => <Ionicons name="person" size={24} />,
        }}
      />

      <Tabs.Screen
        name="chatList"
        options={{
          tabBarIcon: () => <Ionicons name="chatbox" size={24} />,
        }}
      />

<Tabs.Screen
        name="notifications"
        options={{
          title: "inbox",
          tabBarIcon: () => <Ionicons name="notifications" size={24} />,
        }}
      />

    </Tabs>
  );
}
