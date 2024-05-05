import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

import RootContainer from "navigation/rootContainer";
import { subscribeUserState } from "@firebase";
import { logoutUser, setCurrentUser } from "utils/userUtils";
import { setOffices, unloadOffices } from "utils/officeUtils";

export default function App() {
  useEffect(() => {
    subscribeUserState(async (user) => {
      try {
        if (user) {
          await setCurrentUser(user.uid);
          await setOffices();
        } else {
          unloadOffices();
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
