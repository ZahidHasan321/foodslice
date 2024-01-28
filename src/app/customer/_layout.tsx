import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";

export default function AppLayout() {
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {}, [search]);

  return (
    <Tabs screenOptions={{
      headerShown:false
    }}>
      <Tabs.Screen name="home" options={{
        headerShown:true,
        title:'Foodslice',
        tabBarIcon: () => <Ionicons name="home" size={24} />
      }}/>
      <Tabs.Screen name="notifications" options={{
        headerShown:true,
         title:'inbox',
        tabBarIcon: () => <Ionicons name="notifications" size={24} />
      }}/>

      <Tabs.Screen name="profile" options={{
       
        tabBarIcon: () => <Ionicons name="person" size={24} />
      }}/>


      <Tabs.Screen name="[restaurant]" options={{
        tabBarStyle:{display:'none'},
        tabBarButton: () => null,
        tabBarIcon: () => null 
      }}/>

<Tabs.Screen name="types/[type]" options={{
        tabBarStyle:{display:'none'},
        tabBarButton: () => null,
        tabBarIcon: () => null 
      }}/>
    </Tabs>
  );
}
