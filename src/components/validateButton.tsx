import { colors } from "@theme";
import { Button } from "react-native-paper";

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
      buttonColor={colors.primary}
      disabled={loading}
      style={{ borderRadius: 5 }}
      contentStyle={{
        flexDirection: iconPos === "right" ? "row-reverse" : "row",
      }}
    />
  );
};
