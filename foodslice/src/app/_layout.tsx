import "./setup";
require("../themes/colorScheme");
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider } from "@react-navigation/native";

import { CustomLightTheme, CustomDarkTheme } from "@/themes/theme";
import { Appearance } from "react-native";

export default function Layout() {
  const colorScheme = Appearance.getColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? CustomDarkTheme : CustomLightTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Slot />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
