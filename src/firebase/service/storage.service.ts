import {
  getDownloadURL,
  getStorage,
  ref,
  StorageReference,
  uploadBytes,
} from "firebase/storage";
import uuid from "react-native-uuid";

import { app } from "@fb-config";
import { getStorageErrMessage } from "utils/errorUtils";
import { notificationToast } from "utils/toast";

const storage = getStorage(app);

export const assetsRef = ref(storage, "Assets");
export const imgPostRef = ref(storage, "ImgPosts");
export const imgClubPartnerRef = ref(storage, "ImgClubPartenariat");

function getImgURL(storageRef: StorageReference, id: string) {
  try {
    const imgRef = ref(storageRef, `/${id}`);
    return getDownloadURL(imgRef);
  } catch (error) {
    const msg = getStorageErrMessage(error);
    notificationToast("error", msg);
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
    throw e;
  }
}

export { getImgURL, uploadImage };
