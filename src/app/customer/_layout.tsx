import { Stack } from "expo-router";
import Profile from "./profile";
import { Text } from "react-native-ui-lib";
import { useEffect, useState } from "react";

export default function AppLayout() {
  const [ searchEnabled, setSearchEnabled ] = useState(false);
  const [ search, setSearch ] = useState('')

  useEffect(()=>{
    
  },[search])

  return (
    <Stack 
      screenOptions={{
        title:null,
        headerLeft: (props) => !searchEnabled && <Profile/>,
        headerSearchBarOptions: {
          placeholder: 'search for items',
          onChangeText: (e) => setSearch(e.nativeEvent.text), 
          onOpen: () => {
            setSearchEnabled(true);
          },
          onClose: () => {
            setSearchEnabled(false);
          }
        }
      }}
    />
  );
}
