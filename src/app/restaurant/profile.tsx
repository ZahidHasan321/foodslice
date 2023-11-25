import app from "@/configs/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "react-native-ui-lib";

const Profile = () => { 
    const auth = getAuth(app)
    return(
        <SafeAreaView>
            <Button  label='sign out' onPress={() => signOut(auth)}/>
        </SafeAreaView>
    )
}

export default Profile;