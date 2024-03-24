import { FlatList, View } from "react-native";
import { Button } from "react-native-paper";
import { logoutUser } from "utils/user";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button children="LOGOUT" onPress={() => logoutUser()} />
    </View>
  );
}
