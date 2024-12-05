import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";

import RootContainer from "navigation/rootContainer";
import { subscribeUserState, useAuth } from "@firebaseApi";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { signout, loginHandle } = useAuth();
  useEffect(() => {
    subscribeUserState(async (userAuth) => {
      try {
        if (userAuth) {
          await loginHandle(userAuth.uid);
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
      <RootContainer />
    </SafeAreaProvider>
  );
}
