import { useAuth } from "@/contexts/auth";
import React from "react";
import { Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  const { isLoading, user } = useAuth();

  if (isLoading || user === null) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView>
      <Text>Home</Text>
    </SafeAreaView>
  );
};

export default App;
