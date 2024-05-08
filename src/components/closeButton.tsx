import { colors } from "@theme";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export const CloseButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ alignSelf: "flex-end" }}>
      <Ionicons
        name="close-circle-outline"
        size={35}
        color={colors.white}
        style={{ alignSelf: "flex-end", marginRight: 15 }}
      />
    </TouchableOpacity>
  );
};
