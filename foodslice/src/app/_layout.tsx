import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./setup";
require("../themes/colorScheme");

import { ThemeProvider } from "@react-navigation/native";

import { CustomDarkTheme, CustomLightTheme } from "@/themes/theme";
import { setBackgroundColorAsync } from "expo-system-ui";
import { Appearance, Text } from "react-native";
import { Provider, useAuth } from "@/contexts/auth";

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
      ? CustomDarkTheme.colors.background
      : CustomLightTheme.colors.background
  );

  const { authInitialized, user } = useAuth();

  console.log(authInitialized, user)

  if (!authInitialized && !user) return null;

 

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? CustomDarkTheme : CustomLightTheme}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Slot />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
