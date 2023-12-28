import React from "react";
import app from "@/configs/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View } from "react-native-ui-lib";
import { useAuth } from "@/contexts/auth";

const Profile = () => { 
    const { user } = useAuth()
    return(
        <SafeAreaView style={{flex:1 }}>
             <View>
                <Text>{user.displayName}</Text>
             </View>
        </SafeAreaView>
    )
}

export default Profile;