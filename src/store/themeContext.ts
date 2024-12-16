import React from "react";

export const PreferencesContext = React.createContext<{
  toggleTheme: () => void;
  isThemeDark: boolean;
}>({
  toggleTheme: () => {},
  isThemeDark: false,
});
