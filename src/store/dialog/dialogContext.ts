// DialogManager.js
import { createContext, useContext } from "react";

export type ShowDialogProps = {
  title: string;
  message?: string;
  buttons?: { text: string; onPress?: () => void }[];
};

type DialogContextType = {
  showDialog: ({ title, message, buttons }: ShowDialogProps) => void;
};

export const DialogContext = createContext<DialogContextType | null>(null);

export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(
      "useDialog doit être utilisé à l'intérieur d'un DialogProvider"
    );
  }
  return context;
};
