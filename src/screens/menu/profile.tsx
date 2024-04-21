import { Button } from "react-native-paper";
import { logoutUser } from "utils/user.utils";

export function ProfileScreen() {
  return (
    <>
      <Button children="LOGOUT" onPress={logoutUser} />
    </>
  );
}
