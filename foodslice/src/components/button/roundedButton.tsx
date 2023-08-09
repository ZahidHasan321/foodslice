import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Colors, Text } from "react-native-ui-lib";

export type PressableState = Readonly<{
  pressed: boolean;
  hovered?: boolean;
  focused?: boolean;
}>;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: Colors.blue60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  focused: {
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

type button = {
  label: string;
  handlePress: any;
  [x: string]: any;
};

const RoundedButton = ({ label, handlePress, ...restProps }: button) => {
  const pressed = useSharedValue(false);

  const uas = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pressed.value ? 1.2 : 1 }]
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
    .onStart(() => {
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

  return (
    <GestureDetector gesture={Gesture.Exclusive(longPressGesture,tapGesture)}>
      <Animated.View style={uas}>
        <Pressable
          style={({ pressed, hovered, focused }: PressableState) => [
            [styles.button, hovered && styles.focused],
          ]}
          onPress={handlePress}
          onLongPress={handlePress}
          {...restProps}
        >
          <Text>{label}</Text>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

export default RoundedButton;
