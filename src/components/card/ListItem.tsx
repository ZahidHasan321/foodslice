import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { Switch } from "react-native-gesture-handler";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { Card, Text, View } from "react-native-ui-lib";
const Buffer = require("buffer").Buffer;

const ListItem = ({ item, refreshPage }) => {
  const [enabled, setEnabled] = useState(item.available);
 
  const handleDelete = () => {
    axios.delete(process.env.EXPO_PUBLIC_API_URL + '/items/deleteItem', {
      params:{
        id:item._id
      }
    })
    .then(res =>{
      refreshPage();
    })
  }

  const handleAvailablity = () => {
    setEnabled(!enabled)

    axios.put(process.env.EXPO_PUBLIC_API_URL + '/items/updateAvailability', {
      id: item._id,
      value: !enabled
    })
  }
  
  return (
    <Card
      style={{
        width: responsiveWidth(95),
        borderWidth: 0,
        display: "flex",
        flexDirection: "row",
        height: 80,
      }}
    >
      <Card.Image
         source={{
          uri:
            'data:image/jpeg;base64,' + Buffer(item.img.data.data).toString("base64") //data.data in your case
        }}
        style={{
          height: "100%",
          width: "30%",
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 10,
        }}
      />
      <Card.Section
        content={[
          { text: item.name, text70: true },
          { text: "\u0024" + item.price, opacity: 0.7 }
        ]}
        contentStyle={{ paddingLeft: 10, alignItems: "flex-start" }}
      />
      <View
        style={{
          marginLeft: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <TouchableOpacity onPress={()=> {}}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={30}
            color="black"
          />
        </TouchableOpacity> */}
        <Menu>
          <MenuTrigger
            children={
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={30}
                color="black"
              />
            }
          />
          <MenuOptions optionsContainerStyle={{ width: 100 }}>
            <MenuOption
              onSelect={() => router.push(`/restaurant/${item._id}`)}
              style={{
                display: "flex",
                flexDirection: "row",
                borderBottomWidth: 1,
                borderBottomColor: "#0505055c",
              }}
            >
              <Feather name="edit" size={20} color="black" />
              <Text style={{ marginLeft: 10 }}>Edit</Text>
            </MenuOption>
            <MenuOption
              onSelect={handleDelete}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <Feather name="trash-2" size={20} color="black" />
              <Text style={{ color: "red", marginLeft: 10 }}>Delete</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
        <Switch value={enabled} onValueChange={handleAvailablity} />
      </View>
    </Card>
  );
};

// <Text>
//           {"\u0024"}
//           {item.price}
//         </Text>

export default ListItem;