import { getApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import {
  assetsRef,
  getImgURL,
  imgClubPartnerRef,
  imgPostRef,
  uploadImage,
} from "@fb/service/storage.service";
import { Partnership, PartnershipFieldNames } from "@types";
import { storageUrl } from "@fb-config";

const app = getApp();
const db = getFirestore(app);
const partnerCollection = collection(db, "Partnership");

function subscribeAllPartnership(
  setState: (partnerList: Partnership[]) => void
) {
  try {
    return onSnapshot(partnerCollection, async (snapshot) => {
      const partnerList = snapshot.docs.map(async (doc) => {
        const partnerData = doc.data();
        const logoUrl =
          partnerData.logoId &&
          (await getImgURL(imgClubPartnerRef, partnerData.logoId));
        const partnership: Partnership = {
          id: doc.id,
          name: partnerData.name,
          officeId: partnerData.officeId,
          logoUrl,
          description: partnerData.description,
          address: partnerData.address,
          addressMap: partnerData.addressMap,
          benefits: partnerData.benefits,
        };
        return partnership;
      });
      const partnerListResolved = await Promise.all(partnerList);
      setState(partnerListResolved);
    });
  } catch (e: any) {
    throw new Error(`[subscribeAllPartnership] ${e}`);
  }
}

async function createPartnership(props: PartnershipFieldNames) {
  const partnerFields = {
    name: props.name,
    officeId: props.office.value,
    description: props.description || "",
    address: props.address || "",
    addressMap: props.addressMap || "",
    logoId: props.logoFile || "",
    benefits: props.benefits?.map(({ value }) => value) || [],
  };
  try {
    if (props.logoFile) {
      const today = Timestamp.now().seconds;
      const name = await uploadImage(
        props.logoFile,
        `${today}_partner_`,
        imgClubPartnerRef
      );
      partnerFields["logoId"] = name;
    }
    await addDoc(partnerCollection, partnerFields);
  } catch (e) {
    throw new Error("[createPartnership]: " + e);
  }
}

async function updatePartnership(props: PartnershipFieldNames, id: string) {
  try {
    const partnerRef = doc(partnerCollection, id);
    const snapshot = await getDoc(partnerRef);
    if (!snapshot.exists()) {
      throw "Cet élément n'existe pas";
    }
    const partnerData = snapshot.data();
    const updatedFields = {
      name: props.name,
      officeId: props.office.value,
      description: props.description || "",
      address: props.address || "",
      addressMap: props.addressMap || "",
      logoId: props.logoFile || "",
      benefits: props.benefits?.map(({ value }) => value) || [],
    };
    if (props.logoFile) {
      if (!props.logoFile.startsWith(storageUrl)) {
        const today = Timestamp.now().seconds;
        const name = await uploadImage(
          props.logoFile,
          `${today}_partner_`,
          imgClubPartnerRef
        );
        updatedFields["logoId"] = name;
        if (partnerData.logoId) {
          deleteObject(ref(assetsRef, partnerData.logoId));
        }
      } else {
        delete updatedFields.logoId;
      }
    } else {
      updatedFields["logoId"] = "";
      if (partnerData?.logoId) {
        deleteObject(ref(imgPostRef, partnerData?.logoId));
      }
    }
    await updateDoc(partnerRef, updatedFields);
  } catch (e) {
    throw new Error("[updatePartner]: " + e);
  }
}

async function deletePartnership(id: string) {
  try {
    const partnerRef = doc(partnerCollection, id);
    const snapshot = await getDoc(partnerRef);
    if (snapshot.exists()) {
      const partnerData = snapshot.data();
      if (partnerData?.logoId) {
        deleteObject(ref(imgClubPartnerRef, partnerData?.logoId));
      }
      await deleteDoc(partnerRef);
    }
  } catch (e) {
    throw new Error("[delete partnership]: " + e);
  }
}

export {
  subscribeAllPartnership,
  createPartnership,
  updatePartnership,
  deletePartnership,
};
