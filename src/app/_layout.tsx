import { ThemeProvider } from "@shopify/restyle";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider, useAuth } from "@/contexts/auth";
import { darkTheme, lightTheme } from "@/themes/theme";
import { setBackgroundColorAsync } from "expo-system-ui";
import React from "react";
import { Appearance } from "react-native";
import { MenuProvider } from "react-native-popup-menu";


export default function Layout() {
  return (
    <Provider>
      <RootLayout />
    </Provider>
  );
}

function RootLayout() {
  const colorScheme = Appearance.getColorScheme();

  setBackgroundColorAsync(
    colorScheme === "dark"
      ? lightTheme.colors.mainBackground
      : lightTheme.colors.mainBackground
  );

  const { authInitialized, user } = useAuth();


  if (!authInitialized && !user) return null;

  return (
    <ThemeProvider theme={colorScheme === "dark" ? darkTheme : lightTheme}>
      <MenuProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <Slot />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </MenuProvider>
    </ThemeProvider>
  );
}
