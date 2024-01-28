import { Provider, useAuth } from "@/contexts/auth";
import { SocketContext } from "@/contexts/socketProvider";
import usePushNotifications from "@/hooks/usePushNotifications";
import { socket } from "@/service/socket";
import { darkTheme, lightTheme } from "@/themes/theme";
import { ThemeProvider } from "@shopify/restyle";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { setBackgroundColorAsync } from "expo-system-ui";
import React, { useContext, useEffect, useState } from "react";
import { Appearance, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export function useSocket() {
  return useContext(SocketContext);
}

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  return (
    <Provider>
      <RootLayout />
    </Provider>
  );
}

function RootLayout() {
  const colorScheme = Appearance.getColorScheme();
  const { authInitialized, user } = useAuth();

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [message, setMessage] = useState(null);
  const { schedulePushNotification } = usePushNotifications();

  useEffect(() => {
    if(authInitialized && user && isConnected){
      socket.emit("joinChat", {
        senderId: user.uid
      })
    }
  },[authInitialized, user, isConnected])

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onGetMessage(message) {
      schedulePushNotification(user?.displayName, message.content, user?.uid);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('getMessage', onGetMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('getMessage', onGetMessage);
    };
  }, [authInitialized, user]);


  if (!authInitialized && !user) {
    return null;
  }

  setBackgroundColorAsync(
    colorScheme === "dark"
      ? lightTheme.colors.mainBackground
      : lightTheme.colors.mainBackground
  );

  
  return (
    <ThemeProvider theme={colorScheme === "dark" ? darkTheme : lightTheme}>
      <StatusBar barStyle="dark-content" />
      <SocketContext.Provider value={{socket, isConnected}}>
        <MenuProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <Slot />
              <Toast />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </MenuProvider>
      </SocketContext.Provider>
    </ThemeProvider>
  );
}
