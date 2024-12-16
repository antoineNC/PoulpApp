import { createContext, Dispatch, SetStateAction } from "react";

export const PreferencesContext = createContext<{
  toggleTheme: Dispatch<SetStateAction<boolean>>;
  isThemeDark: boolean;
}>({
  toggleTheme: () => {},
  isThemeDark: false,
});
