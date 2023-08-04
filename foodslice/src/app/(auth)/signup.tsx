import { Link } from "expo-router";
import { Text, View } from "react-native-ui-lib";



const Signup = () => {
    return(
        <View>
            <Text>Signup page</Text>
            <Link href={"/login"}>Go to login</Link>
        </View>
    )
}

export default Signup;