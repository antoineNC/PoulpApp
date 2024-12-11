import { getApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  assetsRef,
  getImgURL,
  imgPostRef,
  uploadImage,
} from "./storage.service";
import { deleteObject, ref } from "firebase/storage";
import { storageUrl } from "@fb-config";
import {
  FirestoreOffice,
  Office,
  OfficeFormFields,
  RoleOffice,
  UpdateOfficeFields as UpdateOfficeFields,
} from "types/office.type";

const app = getApp();
const db = getFirestore(app);
const userCollection = collection(db, "Users");
const roleCollection = collection(db, "RoleBureau");

function subscribeAllOffice(setState: (officeList: Office[]) => void) {
  try {
    const q = query(
      userCollection,
      where("role", "in", ["BDE", "BDS", "BDA", "I2C"])
    );
    return onSnapshot(q, async (snapshot) => {
      const allOffice = snapshot.docs.map(async (officeDoc) => {
        const officeData = officeDoc.data() as FirestoreOffice;
        const logoUrl =
          officeData.logoId && (await getImgURL(assetsRef, officeData.logoId));
        const office: Office = {
          id: officeDoc.id,
          name: officeData.name,
          acronym: officeData.acronym,
          description: officeData.description,
          mail: officeData.mail,
          members: officeData.members,
          logoUrl,
        };
        return office;
      });
      const allOfficeResolved = await Promise.all(allOffice);
      setState(allOfficeResolved);
    });
  } catch (e) {
    throw new Error(`[subscribeAllOffice] ${e}`);
  }
}

async function updateOffice(props: OfficeFormFields, id: string) {
  try {
    const officeRef = doc(userCollection, id);
    const officeDoc = await getDoc(officeRef);
    if (!officeDoc.exists()) {
      throw "Cet élément n'existe pas";
    }
    const officeData = officeDoc.data() as FirestoreOffice;
    const updatedFields: UpdateOfficeFields = {
      acronym: props.acronym,
      name: props.name,
      mail: props.mail,
      description: props.description,
      logoId: props.logoFile,
      members: props.members,
    };
    if (props.logoFile) {
      if (!props.logoFile.startsWith(storageUrl)) {
        const logoId = await uploadImage(
          props.logoFile,
          officeData.acronym.toLowerCase(),
          assetsRef
        );
        updatedFields["logoId"] = logoId;
        if (officeData.logoId) {
          deleteObject(ref(assetsRef, officeData.logoId));
        }
      }
    } else {
      if (officeData.logoId) {
        deleteObject(ref(imgPostRef, officeData.logoId));
      }
    }
    await updateDoc(officeRef, updatedFields);
  } catch (e) {
    throw new Error("[updateOffice] " + e);
  }
}

function subscribeAllRole(setState: (roleOfficeList: RoleOffice[]) => void) {
  try {
    return onSnapshot(roleCollection, async (snapshot) => {
      const allRole = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as RoleOffice)
      );
      setState(allRole);
    });
  } catch (e) {
    throw new Error("[subscribeAllRole] " + e);
  }
}

export { subscribeAllOffice, subscribeAllRole, updateOffice };
