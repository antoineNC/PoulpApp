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
import { storageUrl } from "@fb-config";
import {
  assetsRef,
  getImgURL,
  imgClubPartnerRef,
  imgPostRef,
  uploadImage,
} from "@fb/service/storage.service";
import { formattedToday } from "utils/dateUtils";
import {
  Club,
  ClubFormFields,
  CreateClubFields,
  FirestoreClub,
  UpdateClubFields,
} from "types/club.type";

const app = getApp();
const db = getFirestore(app);
const clubCollection = collection(db, "Club");

function subscribeAllClub(setState: (clubList: Club[]) => void) {
  try {
    return onSnapshot(clubCollection, async (snapshot) => {
      const clubList = snapshot.docs.map(async (clubDoc) => {
        const clubData = clubDoc.data() as FirestoreClub;
        const logoUrl =
          clubData.logoId &&
          (await getImgURL(imgClubPartnerRef, clubData.logoId));
        const club: Club = {
          id: clubDoc.id,
          name: clubData.name,
          officeId: clubData.officeId,
          logoUrl,
          description: clubData.description,
          contact: clubData.contact,
        };
        return club;
      });
      const clubListResolved = await Promise.all(clubList);
      setState(clubListResolved);
    });
  } catch (e) {
    throw e;
  }
}

async function createClub(props: ClubFormFields) {
  const clubFields: CreateClubFields = {
    name: props.name,
    officeId: props.office.value,
    contact: props.contact || "",
    description: props.description || "",
    logoId: props.logoFile || "",
  };
  try {
    if (props.logoFile) {
      const today = formattedToday();
      const logoId = await uploadImage(
        props.logoFile,
        `${today}_club_`,
        imgClubPartnerRef
      );
      clubFields["logoId"] = logoId;
    }
    await addDoc(clubCollection, clubFields);
  } catch (e) {
    throw e;
  }
}

async function updateClub(props: ClubFormFields, id: string) {
  try {
    const clubRef = doc(clubCollection, id);
    const clubDoc = await getDoc(clubRef);
    if (!clubDoc.exists()) {
      throw "office/club-not-found";
    }
    const clubData = clubDoc.data() as FirestoreClub;
    const updatedFields: UpdateClubFields = {
      name: props.name,
      officeId: props.office.value,
      contact: props.contact,
      description: props.description,
      logoId: props.logoFile,
    };
    if (props.logoFile) {
      if (!props.logoFile.startsWith(storageUrl)) {
        const today = formattedToday();
        const logoId = await uploadImage(
          props.logoFile,
          `${today}_club_`,
          imgClubPartnerRef
        );
        updatedFields["logoId"] = logoId;
        if (clubData.logoId) {
          await deleteObject(ref(assetsRef, clubData.logoId));
        }
      } else {
        delete updatedFields.logoId;
      }
    } else {
      if (clubData.logoId) {
        await deleteObject(ref(imgPostRef, clubData.logoId));
      }
    }
    await updateDoc(clubRef, updatedFields);
  } catch (e) {
    throw e;
  }
}

async function deleteClub(id: string) {
  try {
    const clubRef = doc(clubCollection, id);
    const clubDoc = await getDoc(clubRef);
    if (clubDoc.exists()) {
      const clubData = clubDoc.data() as FirestoreClub;
      if (clubData.logoId) {
        await deleteObject(ref(imgClubPartnerRef, clubData.logoId));
      }
      await deleteDoc(clubRef);
    }
  } catch (e) {
    throw e;
  }
}

export { subscribeAllClub, createClub, updateClub, deleteClub };
