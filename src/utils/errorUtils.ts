import { FirebaseError } from "firebase/app";
import { signOutUser } from "@fb/service/auth.service";
import { resetAllStores } from "utils/storeUtils";
import { notificationToast } from "./toast";

export function getErrorCode(error: unknown) {
  if (error instanceof FirebaseError) {
    return error.code;
  } else if (error instanceof Error) {
    return error.message;
  }
  console.error(error);
  return String(error);
}

export async function signOutAndResetStores() {
  try {
    resetAllStores();
    await signOutUser();
  } catch (error) {
    console.error("Error signing out: ", JSON.stringify(error));
    notificationToast("error", "Erreur lors de la déconnexion.");
  }
}

export function getErrorMessage(error: unknown) {
  const msg = getErrorCode(error);
  const code = msg.split("/");
  if (code[0] === "auth") {
    switch (code[1]) {
      // erreur firebase
      case "invalid-credential":
        return "Les identifiants sont incorrects.";
      case "email-already-in-use":
        return "L'adresse mail est déjà associée à un compte. Connectez-vous ou utilisez une autre adresse.";
      // a partir d'ici, erreur custom
      case "invalid-code":
        return "Le code ENSC est incorrect.";
      case "no-data":
        return "Le profil n'existe pas.";
      default:
        break;
    }
  } else if (code[0] === "post") {
    switch (code[1]) {
      case "not-found":
        return "Le post n'existe pas.";
      default:
        break;
    }
  } else if (code[0] === "storage") {
    switch (code[1]) {
      case "object-not-found":
        return "L'élément n'existe pas";
      case "unauthorized":
        // User doesn't have permission to access the object
        return "Accès non autorisé";
      case "canceled":
        // User canceled the upload
        return "Téléchargement annulé";
      case "unknown":
        return `Erreur inconnue. ${msg}`;
      default:
        break;
    }
  } else if (code[0] === "office") {
    switch (code[1]) {
      case "not-found":
        return "Le bureau n'existe pas.";
      default:
        break;
    }
  }
  return "Une erreur est survenue. Veuillez réessayer ou contacter le support.";
}
