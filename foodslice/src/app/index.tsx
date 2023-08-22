import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View } from "react-native-ui-lib";
import { getAuth, signOut } from "firebase/auth";
import app from "@/configs/firebaseConfig";
import { useTheme } from "@shopify/restyle";

const App = () => {
  const auth = getAuth(app);
  const theme = useTheme();
 
  return (
    <SafeAreaView>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Text style={{ color: theme.colors.text }}>Home</Text>
        <Link style={{ color: theme.colors.textPrimary }} href={"/login"}>
          Signin
        </Link>
        <Button onPress={() =>  signOut(auth)} label="signout" />
      </View>
    </SafeAreaView>
  );
};

export default App;
