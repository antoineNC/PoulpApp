import { toast } from "@backpackapp-io/react-native-toast";

export function notificationToast(
  type: "success" | "error" | "loading",
  message: string
) {
  toast[type](message, { position: 2 });
}
