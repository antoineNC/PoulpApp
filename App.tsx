import { useCallback, useMemo, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  MD3LightTheme,
  MD3DarkTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import defaultCustomColor from "styles/defaultColorScheme.json";
import darkCustomColor from "styles/darkColorScheme.json";

import RootContainer from "navigation/rootContainer";
import { useAuthState } from "hooks/authentication";
import { PreferencesContext } from "@context/themeContext";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});
const CombinedLightTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    ...defaultCustomColor.colors,
  },
};
const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    ...darkCustomColor.colors,
  },
};

SplashScreen.preventAutoHideAsync();

export default function App() {
  const authIsDone = useAuthState(false);
  const [isThemeDark, setIsThemeDark] = useState(true);

  let theme = isThemeDark ? CombinedDarkTheme : CombinedLightTheme;

  const toggleTheme = useCallback(() => {
    return setIsThemeDark((value) => !value);
  }, []);

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  const onLayoutRootView = useCallback(async () => {
    if (authIsDone) {
      await SplashScreen.hideAsync();
    }
  }, [authIsDone]);

  if (!authIsDone) {
    return null;
  }

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider onLayout={onLayoutRootView}>
          <RootContainer theme={theme} />
        </SafeAreaProvider>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}
