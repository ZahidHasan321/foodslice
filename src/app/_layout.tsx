import { ThemeProvider } from "@shopify/restyle";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider, useAuth } from "@/contexts/auth";
import { darkTheme, lightTheme } from "@/themes/theme";
import { setBackgroundColorAsync } from "expo-system-ui";
import React, { useCallback, useEffect, useState } from "react";
import { Appearance } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";

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
  const [appIsReady, setAppIsReady] = useState(false);
  const { authInitialized, user } = useAuth();

  useEffect(() => {
    if (authInitialized && user) {
      setAppIsReady(true);
    }
  }, [authInitialized, user]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  setBackgroundColorAsync(
    colorScheme === "dark"
      ? lightTheme.colors.mainBackground
      : lightTheme.colors.mainBackground
  );

  if (!authInitialized && !user) return null;

  return (
    <ThemeProvider theme={colorScheme === "dark" ? darkTheme : lightTheme}>
      <MenuProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider onLayout={onLayoutRootView}>
            <Slot/>
            <Toast />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </MenuProvider>
    </ThemeProvider>
  );
}
