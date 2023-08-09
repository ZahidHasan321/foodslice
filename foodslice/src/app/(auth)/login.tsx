import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from '@react-navigation/native';



const Signup = () => {
    const {colors} = useTheme()
    return(
        <SafeAreaView>
            <View>
                <Text style={{color:colors.text}}>Login page</Text>
                <Link href={"/signup"}>Go to signup</Link>
            </View>
        </SafeAreaView>
    )
}

export default Signup;