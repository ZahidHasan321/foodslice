import { Tabs } from "expo-router";
import { useEffect, useState } from "react";


export default function AppLayout() {
  const [ searchEnabled, setSearchEnabled ] = useState(false);
  const [ search, setSearch ] = useState('')

  useEffect(()=>{
    
  },[search])

  return (
    <Tabs
      screenOptions={{
        headerShown:false
      }}
    >
      
      <Tabs.Screen 
      name="restaurantRegistration"
      options={{
        href: null,
        tabBarStyle:{display:"none"}
      }}
      />
    </Tabs>
  );
}
