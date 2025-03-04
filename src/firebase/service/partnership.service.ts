import { getApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
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
import { storageUrl } from "@fb-config";
import {
  CreatePartnershipFields,
  FirestorePartnership,
  Partnership,
  PartnershipFormFields,
  UpdatePartnershipFields,
} from "types/partnership.type";
import { formattedToday } from "utils/dateUtils";

const app = getApp();
const db = getFirestore(app);
const partnerCollection = collection(db, "Partnership");

function subscribeAllPartnership(
  setState: (partnerList: Partnership[]) => void
) {
  try {
    return onSnapshot(partnerCollection, async (snapshot) => {
      const partnerList = snapshot.docs.map(async (partnerDoc) => {
        const partnerData = partnerDoc.data() as FirestorePartnership;
        const logoUrl =
          partnerData.logoId &&
          (await getImgURL(imgClubPartnerRef, partnerData.logoId));
        const partnership: Partnership = {
          id: partnerDoc.id,
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
  } catch (e) {
    throw e;
  }
}

async function createPartnership(props: PartnershipFormFields) {
  const partnerFields: CreatePartnershipFields = {
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
      const today = formattedToday();
      const logoId = await uploadImage(
        props.logoFile,
        `${today}_partner_`,
        imgClubPartnerRef
      );
      partnerFields["logoId"] = logoId;
    }
    await addDoc(partnerCollection, partnerFields);
  } catch (e) {
    throw e;
  }
}

async function updatePartnership(props: PartnershipFormFields, id: string) {
  try {
    const partnerRef = doc(partnerCollection, id);
    const partnerDoc = await getDoc(partnerRef);
    if (!partnerDoc.exists()) {
      throw "office/partnership-not-found";
    }
    const partnerData = partnerDoc.data() as FirestorePartnership;
    const updatedFields: UpdatePartnershipFields = {
      name: props.name,
      officeId: props.office.value,
      description: props.description,
      address: props.address,
      addressMap: props.addressMap,
      logoId: props.logoFile,
      benefits: props.benefits?.map(({ value }) => value),
    };
    if (props.logoFile) {
      if (!props.logoFile.startsWith(storageUrl)) {
        const today = formattedToday();
        const logoId = await uploadImage(
          props.logoFile,
          `${today}_partner_`,
          imgClubPartnerRef
        );
        updatedFields["logoId"] = logoId;
        if (partnerData.logoId) {
          await deleteObject(ref(assetsRef, partnerData.logoId));
        }
      } else {
        delete updatedFields.logoId;
      }
    } else {
      if (partnerData.logoId) {
        await deleteObject(ref(imgPostRef, partnerData.logoId));
      }
    }
    await updateDoc(partnerRef, updatedFields);
  } catch (e) {
    throw e;
  }
}

async function deletePartnership(id: string) {
  try {
    const partnerRef = doc(partnerCollection, id);
    const partnerDoc = await getDoc(partnerRef);
    if (partnerDoc.exists()) {
      const partnerData = partnerDoc.data() as FirestorePartnership;
      if (partnerData.logoId) {
        await deleteObject(ref(imgClubPartnerRef, partnerData?.logoId));
      }
      await deleteDoc(partnerRef);
    }
  } catch (e) {
    throw e;
  }
}

export {
  subscribeAllPartnership,
  createPartnership,
  updatePartnership,
  deletePartnership,
};
