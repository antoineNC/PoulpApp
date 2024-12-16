import React from "react";

export const PreferencesContext = React.createContext<{
  toggleTheme: () => void;
  isThemeLight: boolean;
}>({
  toggleTheme: () => {},
  isThemeLight: false,
});
