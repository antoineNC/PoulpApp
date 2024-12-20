import { toast } from "@backpackapp-io/react-native-toast";
import { signOutUser } from "@fb/service/auth.service";
import { resetAllStores } from "utils/storeUtils";
import { getErrorMessage } from "./utils";

export async function signOutAndResetStores() {
  try {
    resetAllStores();
    await signOutUser();
  } catch (error) {
    console.error("Error signing out: ", error);
    toast.error("Erreur lors de la déconnexion", { position: 2 });
  }
}

export function getAuthErrMessage(error: unknown) {
  const msg = getErrorMessage(error);
  switch (msg) {
    case "auth/invalid-credential":
      return "Les identifiants sont incorrects.";
    case "register/invalid-code":
      return "Le code ENSC est incorrect.";
    case "auth/email-already-in-use":
      return "L'adresse mail est déjà associée à un compte. Connectez-vous ou utilisez une autre adresse.";
    case "user/no-data":
      return "Le profil n'existe pas.";
    default:
      return "Erreur de connexion";
  }
}
