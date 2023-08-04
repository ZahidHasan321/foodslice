import {  Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native-ui-lib";

const App = () => {
  return(
    <SafeAreaView>
      <View style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}> 
        <Text>Home</Text>
        <Link href={"/login"}>Signin</Link>
      </View>
    </SafeAreaView>

  )
}

export default App;