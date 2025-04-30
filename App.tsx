import { useCallback, useEffect, useMemo, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  MD3LightTheme,
  MD3DarkTheme,
  PaperProvider,
  adaptNavigationTheme,
  ActivityIndicator,
} from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toasts } from "@backpackapp-io/react-native-toast";

import RootContainer from "navigation/rootContainer";
import { useAuthState } from "hooks/authentication";
import { PreferencesContext } from "@context/themeContext";
import { DialogProvider } from "@context/dialog/dialogProvider";
import defaultCustomColor from "styles/defaultColorScheme.json";
import darkCustomColor from "styles/darkColorScheme.json";

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
  useEffect(() => {
    const loadTheme = async () => {
      const value = await AsyncStorage.getItem("isDarkMode");
      if (value !== null) {
        setIsThemeDark(JSON.parse(value));
      }
    };
    loadTheme();
  }, []);

  const theme = isThemeDark ? CombinedDarkTheme : CombinedLightTheme;

  const preferences = useMemo(
    () => ({
      toggleTheme: setIsThemeDark,
      isThemeDark,
    }),
    [isThemeDark]
  );

  const onLayoutRootView = useCallback(async () => {
    if (authIsDone) {
      await SplashScreen.hideAsync();
    }
  }, [authIsDone]);

  if (!authIsDone) {
    return <ActivityIndicator animating={true} />;
  }

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider onLayout={onLayoutRootView}>
          <GestureHandlerRootView>
            <DialogProvider>
              <RootContainer theme={theme} />
              <StatusBar style={isThemeDark ? "light" : "dark"} />
              <Toasts overrideDarkMode={isThemeDark} />
            </DialogProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}
