import { useAuth } from "@firebase";
import { Button } from "react-native-paper";

export function ProfileScreen() {
  const { signout } = useAuth();
  return (
    <>
      <Button children="LOGOUT" onPress={signout} />
    </>
  );
}
