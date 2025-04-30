import { useState } from "react";
import { Dialog, Portal, Text, Button } from "react-native-paper";
import { DialogContext, ShowDialogProps } from "@context/dialog/dialogContext";

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [actions, setActions] = useState<
    { label: string; onPress: () => void }[]
  >([]);

  const showDialog = ({ title, message, buttons }: ShowDialogProps) => {
    setTitle(title);
    message && setContent(message);

    if (buttons && buttons.length > 0) {
      setActions(
        buttons.map((button) => ({
          label: button.text,
          onPress: () => {
            setVisible(false);
            if (button.onPress) button.onPress();
          },
        }))
      );
    } else {
      setActions([
        {
          label: "OK",
          onPress: () => setVisible(false),
        },
      ]);
    }

    setVisible(true);
  };
  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          dismissable
        >
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            <Text>{content}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            {actions.map((action, index) => (
              <Button key={index} onPress={action.onPress}>
                {action.label}
              </Button>
            ))}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </DialogContext.Provider>
  );
};
