import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";

export default function AppLayout() {
  const [ searchEnabled, setSearchEnabled ] = useState(false);
  const [ search, setSearch ] = useState('');

  useEffect(()=>{
    
  },[search])

  return (
    <Tabs>
      <Tabs.Screen name="home" options={{
        tabBarIcon: () =>  <Ionicons name="home" size={24}/>
      }}/>
      <Tabs.Screen name="reservations" options={{
        tabBarIcon: () =>  <Ionicons name="clipboard" size={24}/>
      }}/>
      <Tabs.Screen name="profile" options={{
        tabBarIcon: () =>  <Ionicons name="person" size={24}/>
      }}/>
    </Tabs>

  );
}
