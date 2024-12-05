import { useAuth } from "@firebaseApi";
import { Button } from "react-native-paper";

export function ProfileScreen() {
  const { signout } = useAuth();
  return (
    <>
      <Button children="LOGOUT" onPress={signout} />
    </>
  );
}
