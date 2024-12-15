import { colors } from "@theme";
import { AnimatedFAB, Button } from "react-native-paper";

export const ValidateButton = ({
  text,
  onPress,
  loading,
  icon,
  iconPos = "left",
}: {
  text: string;
  onPress: () => void;
  loading: boolean;
  icon?: string;
  iconPos?: "right" | "left";
}) => {
  return (
    <Button
      mode="contained"
      children={text}
      icon={icon}
      onPress={onPress}
      uppercase
      // buttonColor={colors.primary}
      disabled={loading}
      style={{ borderRadius: 5 }}
      contentStyle={{
        flexDirection: iconPos === "right" ? "row-reverse" : "row",
      }}
    />
  );
};

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
