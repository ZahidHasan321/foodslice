import '@react-navigation/native';

// Override the theme in react native navigation to accept our custom theme props.
declare module '@react-navigation/native' {
  export type ExtendedTheme = {
    dark: boolean;
    colors: {
      primary: string;
      primaryHeavy:string,
      primaryLight:string,
      secondary: string;
      secondaryHeavy: string;
      secondaryLight,
      error: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
      white:string,
      black:string,
      link:string
    };
  };
  export function useTheme(): ExtendedTheme;
}