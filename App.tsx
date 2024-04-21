import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

import RootContainer from "navigation/rootContainer";
import { subscribeUserState } from "firebase/firebase.utils";
import { logoutUser, setUser } from "utils/user.utils";

export default function App() {
  useEffect(() => {
    subscribeUserState(async (user) => {
      try {
        if (user) {
          await setUser(user);
        } else {
          logoutUser();
        }
      } catch (e: any) {
        throw Error(e);
      }
    });
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GluestackUIProvider config={config}>
        <RootContainer />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
