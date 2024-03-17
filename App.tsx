import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import RootContainer from "navigation/rootContainer";
import { subscribeUserState } from "firebase/firebaseUtils";
import { logoutStores, setUser } from "utils/user";

export default function App() {
  useEffect(() => {
    subscribeUserState(async (user) => {
      try {
        if (user) {
          await setUser(user);
        } else {
          logoutStores;
        }
      } catch (e: any) {
        throw Error(e);
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <RootContainer />
    </SafeAreaProvider>
  );
}
