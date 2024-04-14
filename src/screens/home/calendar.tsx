import { Button } from "react-native-paper";
import { logoutUser } from "utils/user";

export default function CalendarScreen() {
  return <Button onPress={() => logoutUser()} children="LOGOUT" />;
}
