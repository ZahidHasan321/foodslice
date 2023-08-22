import { ThemeProvider } from "@shopify/restyle";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./setup";

import { Provider, useAuth } from "@/contexts/auth";
import { darkTheme, lightTheme } from "@/themes/theme";
import { setBackgroundColorAsync } from "expo-system-ui";
import { Appearance } from "react-native";

export default function Layout() {
  return (
    <Provider>
      <RootLayout />
    </Provider>
  );
}

function RootLayout() {
  const colorScheme = Appearance.getColorScheme();


  console.log(colorScheme)

  setBackgroundColorAsync(
    colorScheme === "dark"
      ? darkTheme.colors.mainBackground
      : lightTheme.colors.mainBackground
  );

  const { authInitialized, user } = useAuth();

  if (!authInitialized && !user) return null;

  return (
    <ThemeProvider theme={colorScheme === "dark" ? darkTheme : lightTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Slot />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
