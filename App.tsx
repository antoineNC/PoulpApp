import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

import RootContainer from "navigation/rootContainer";
import { subscribeUserState, useAuth, useOffice, usePost } from "@firebase";

export default function App() {
  const { getCurrentUser, signout } = useAuth();
  const { getAllOffice } = useOffice();
  const { getAllPost } = usePost();
  useEffect(() => {
    subscribeUserState(async (user) => {
      try {
        if (user) {
          await getCurrentUser(user.uid);
          await getAllOffice();
          await getAllPost();
        } else {
          signout();
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
