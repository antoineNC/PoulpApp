import { FirebaseError } from "firebase/app";
import { signOutUser } from "@fb/service/auth.service";
import { resetAllStores } from "utils/storeUtils";
import { notificationToast } from "./toast";

export function getErrorMessage(error: unknown) {
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
      return `Erreur de connexion. Veuillez réessayer, ou contactez le support. ${msg}`;
  }
}

export function getPostErrMessage(error: unknown) {
  const msg = getErrorMessage(error);
  switch (msg) {
    case "post/not-found":
      return "Le post n'existe pas.";
    default:
      return `[post]Erreur. ${msg}`;
  }
}

export function getStorageErrMessage(error: unknown) {
  const msg = getErrorMessage(error);
  switch (msg) {
    case "storage/object-not-found":
      // File doesn't exist
      throw "L'élément n'existe pas";
    case "storage/unauthorized":
      // User doesn't have permission to access the object
      return "Accès non autorisé";
    case "storage/canceled":
      // User canceled the upload
      return "Téléchargement annulé";
    case "storage/unknown":
      // Unknown error occurred, inspect the server response
      return `[storage]Erreur inconnue. ${msg}`;
    default:
      return `[storage]Erreur. ${msg}`;
  }
}
