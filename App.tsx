import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";

import RootContainer from "navigation/rootContainer";
import { useAuthState } from "hooks/authentication";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const authIsDone = useAuthState(false);

  const onLayoutRootView = useCallback(async () => {
    if (authIsDone) {
      await SplashScreen.hideAsync();
    }
  }, [authIsDone]);

  if (!authIsDone) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <RootContainer />
    </SafeAreaProvider>
  );
}
