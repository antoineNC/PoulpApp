import { app } from "@fb-config";
import {
  getDownloadURL,
  getStorage,
  ref,
  StorageReference,
  uploadBytes,
} from "firebase/storage";
import uuid from "react-native-uuid";

const storage = getStorage(app);

export const assetsRef = ref(storage, "Assets");
export const imgPostRef = ref(storage, "ImgPosts");
export const imgClubPartnerRef = ref(storage, "ImgClubPartenariat");

function getImgURL(storageRef: StorageReference, id: string) {
  try {
    const imgRef = ref(storageRef, `/${id}`);
    return getDownloadURL(imgRef);
  } catch (error: any) {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case "storage/object-not-found":
        // File doesn't exist
        throw new Error("[getImgURL] élément non trouvé");
      case "storage/unauthorized":
        // User doesn't have permission to access the object
        throw new Error("[getImgURL] accès non autorisé");
      case "storage/canceled":
        // User canceled the upload
        throw new Error("[getImgURL] upload annulé");
      case "storage/unknown":
        // Unknown error occurred, inspect the server response
        throw new Error("[getImgURL] inconnu: " + error);
      default:
        throw new Error("[getImgURL] erreur inconnue: " + error);
    }
  }
}

async function uploadImage(
  localUri: string,
  name: string,
  storageRef: StorageReference
) {
  try {
    const result = await fetch(localUri);
    const imgBlob = await result.blob();
    const fileName = name + uuid.v4();
    const fileRef = ref(storageRef, fileName);
    await uploadBytes(fileRef, imgBlob);
    return fileName;
  } catch (e) {
    throw new Error("[uploadImage] " + e);
  }
}

export { getImgURL, uploadImage };
