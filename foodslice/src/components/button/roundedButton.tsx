import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { Text } from "react-native-ui-lib";

export type PressableState = Readonly<{
  pressed: boolean;
  hovered?: boolean;
  focused?: boolean;
}>;

type button = {
  label: string;
  handlePress: any;
  buttonWidth?: number;
  scaleFactor?:number;
  [x: string]: any;
};

const RoundedButton = ({
  label = "Button",
  handlePress,
  bgcolor = "#FFFFFF",
  fontColor = "#000000",
  hoveredColor,
  buttonWidth,
  buttonHeight,
  scaleFactor = 1,
  style,
  ...restProps
}: button) => {
  const pressed = useSharedValue(false);

  const uas = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(pressed.value ? scaleFactor : 1) }],
    };
  });
  // const handleEvent = useAnimatedGestureHandler({
  //   onStart: (event, ctx) => {
  //     pressed.value = true;
  //   },
  //   onEnd: (event, ctx) => {
  //     pressed.value = false;
  //   },
  // });
  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      pressed.value = true;
    })
    .onEnd(() => {
      pressed.value = false;
    });

  const longPressGesture = Gesture.LongPress()
    .onStart((e) => {
      pressed.value = true;
    })
    .onEnd((e, success) => {
      if (success) {
        pressed.value = false;
      }
    });

  const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 8,
      elevation: 3,
      backgroundColor: bgcolor,
      width: responsiveWidth(buttonWidth),
      height: 50,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
    label: {
      color: fontColor,
    },
    hovered: {
      backgroundColor: hoveredColor,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 8,

      elevation: 6,
    },
  });

  return (
    <GestureDetector gesture={Gesture.Exclusive(longPressGesture, tapGesture)}>
      <Animated.View style={uas}>
        <Pressable
          style={({ pressed, hovered, focused }: PressableState) => [
            [styles.button, hovered && styles.hovered, style]
          ]}
          onPress={handlePress}
          onLongPress={handlePress}
          {...restProps}
        >
          <Text style={styles.label}>{label}</Text>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

export default RoundedButton;
