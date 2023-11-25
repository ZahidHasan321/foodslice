import app from "@/configs/firebaseConfig";
import { useAuth } from "@/contexts/auth";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  const auth = getAuth(app);
  const { user, userInfo, authInitialized } = useAuth();

  return (
    <SafeAreaView>
      <Text>Home</Text>
    </SafeAreaView>
  );
};

export default App;
