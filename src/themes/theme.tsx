import { createTheme } from "@shopify/restyle";

export const palette = {
  purple: "#5A31F4",
  black: "#0B0B0B",
  white: "#F0F2F3",
  blue: "#007bff",
  cherryRed: "#D2042D",
  darkGray: "#60696b",
  lightGray: "#858e96",
  lightBlue: "#557c93",
  darkBlue: "#08203e",
  oxfordBlue: "#0E182F",
  red: 'red'
};

export const lightTheme = createTheme({
  spacing: {
    s: 8,
    m: 16,
  },

  colors: {
    mainBackground: palette.white,
    mainForeground: palette.black,
    //textColors
    textWhite: palette.white,
    text: palette.black,
    textPrimary: palette.purple,

    primary: "#264653",
    primaryHeavy: "#1A2F38",
    primaryLight: "#5797B2",
    secondary: "#2A9D8F",
    secondaryHeavy: "#228176",
    secondaryLight: "#5ED4C6",

    primaryCardBackground: palette.purple,
    secondaryCardBackground: palette.white,
    primaryCardText: palette.white,
    secondaryCardText: palette.black,
    link: palette.blue,
    error: palette.red,
    lightGrad: palette.lightBlue,
    darkGrad: palette.darkBlue,
  },

  breakpoints: {
    phone: 0,
    longPhone: {
      width: 0,
      height: 812,
    },
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },
});

type Theme = typeof lightTheme;

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    mainBackground: palette.oxfordBlue,
    mainForeground: palette.white,

    //textColors
    text: palette.white,
    textPrimary: palette.lightGray,
    lightGrad: palette.lightGray,
    darkGrad: palette.darkGray,


    secondaryCardBackground: palette.darkGray,
    secondaryCardText: palette.white,
    
  },
};

// import { DarkTheme, DefaultTheme, ExtendedTheme } from "@react-navigation/native";

// export const CustomLightTheme:ExtendedTheme = {
//   dark: false,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: "#264653",
//     primaryHeavy: "#1A2F38",
//     primaryLight: "#5797B2",
//     secondary: "#2A9D8F",
//     secondaryHeavy: "#228176",
//     secondaryLight: "#5ED4C6",
//     error:'#FF0000',
//     white:"#FFFFFF",
//     black:"#000000",
//     link:"#3366CC"
//   },
// };

// export const CustomDarkTheme:ExtendedTheme = {
//   dark: true,
//   colors: {
//     ...DarkTheme.colors,
//     primary: "#264653",
//     primaryHeavy: "#1A2F38",
//     primaryLight: "#5797B2",
//     secondary: "#2A9D8F",
//     secondaryHeavy: "#228176",
//     secondaryLight: "#5ED4C6",
//     background:"#0D171C",
//     error:'#FF0000',
//     white:"#FFFFFF",
//     black:"#000000",
//     link:"#3366CC"
//   },
// };
