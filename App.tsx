import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

import RootContainer from "navigation/rootContainer";
import { subscribeUserState, useAuth, useOffice } from "@firebase";
import { actionSession } from "@context/sessionStore";

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

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <GluestackUIProvider config={config}>
        <RootContainer />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
