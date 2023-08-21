import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View } from "react-native-ui-lib";
import { getAuth, signOut } from "firebase/auth";
import app from "@/configs/firebaseConfig";

const App = () => {
  const auth = getAuth(app);


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
        <Text style={{ color: "white" }}>Home</Text>
        <Link style={{ color: "white" }} href={"/login"}>
          Signin
        </Link>
        <Button onPress={() =>  signOut(auth)} label="signout" />
      </View>
    </SafeAreaView>
  );
};

export default App;
