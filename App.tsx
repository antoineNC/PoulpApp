import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

import RootContainer from "navigation/rootContainer";
import { subscribeUserState, useAuth, useOffice } from "@firebase";
import { actionSession } from "@context/sessionStore";
import { useUnit } from "effector-react";
import { $officeStore } from "@context/officeStore";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { getCurrentUser, signout } = useAuth();
  const { getAllOffice, getAllClub } = useOffice();
  useEffect(() => {
    subscribeUserState(async (userAuth) => {
      try {
        if (userAuth) {
          const { user, role } = await getCurrentUser(userAuth.uid);
          await getAllOffice();
          await getAllClub();
          actionSession.login({ user, role });
        } else {
          signout();
        }
      } catch (e: any) {
        throw Error(e);
      } finally {
        setAppIsReady(true);
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
