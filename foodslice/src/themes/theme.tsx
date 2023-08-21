import { DarkTheme, DefaultTheme, ExtendedTheme} from "@react-navigation/native";

export const CustomLightTheme:ExtendedTheme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: "#264653",
    primaryHeavy: "#1A2F38",
    primaryLight: "#5797B2",
    secondary: "#2A9D8F",
    secondaryHeavy: "#228176",
    secondaryLight: "#5ED4C6",
    error:'#FF0000',
    white:"#FFFFFF",
    black:"#000000",
    link:"#3366CC"
  },
};

export const CustomDarkTheme:ExtendedTheme = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: "#264653",
    primaryHeavy: "#1A2F38",
    primaryLight: "#5797B2",
    secondary: "#2A9D8F",
    secondaryHeavy: "#228176",
    secondaryLight: "#5ED4C6",
    background:"#0D171C",
    error:'#FF0000',
    white:"#FFFFFF",
    black:"#000000",
    link:"#3366CC"
  },
};
