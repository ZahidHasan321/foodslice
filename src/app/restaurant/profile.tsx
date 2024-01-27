import { useAuth } from "@/contexts/auth";
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Image, Text, View } from "react-native-ui-lib";
import { AntDesign } from '@expo/vector-icons'; 
import useImgBB from "@/hooks/useIMGBB";

const Profile = () => {
  const { user, logOut, updateUserProfile } = useAuth();
  const [ profilePicture, setProfilePicture ] = useState(null)
  const [username, setUserName] = useState(null)


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
      const imageUrl = await useImgBB(result.assets[0].uri, 'user.uid')
      updateUserProfile( user.displayName || 'Not found', imageUrl || user.photoURL)
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {user ? (
          <View style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{ uri: profilePicture || user.photoURL  }}
                alt="Profile Image"
                style={styles.profileImage}
              />
              <View style={styles.editIconContainer}>
                <AntDesign name="edit" size={24}/>
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>{user.displayName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            {/* Add more user information like address, etc., as needed */}
            <Button
              label="Sign Out"
              onPress={logOut}
              style={styles.signOutButton}
            />
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
  },
  editIcon: {
    fontSize: 18,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: "#3498db",
  },
});

export default Profile;
