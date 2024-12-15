import { AnimatedFAB } from "react-native-paper";

export const FloatingValidateBtn = ({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) => (
  <AnimatedFAB
    icon={"content-save"}
    label={label}
    extended={true}
    onPress={onPress}
    visible={true}
    animateFrom="right"
    style={{
      position: "absolute",
      bottom: 20,
      alignSelf: "center",
    }}
    variant="secondary"
    disabled={disabled}
  />
);
