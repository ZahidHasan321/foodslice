import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const Signup = () => {
    return(
        <SafeAreaView>
            <View>
                <Text>Login page</Text>
                <Link href={"/signup"}>Go to signup</Link>
            </View>
        </SafeAreaView>
    )
}

export default Signup;