import { Link } from "expo-router";
import {
  GestureHandlerRootView
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Text, View } from "react-native-ui-lib";
import "./setup";
require("../themes/foundationConfigs.tsx");

const App = () => {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <SafeAreaView>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Text style={{ color: Colors.$textSuccess }}>Home</Text>
          <Link href={"/login"}>Signin</Link>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;
