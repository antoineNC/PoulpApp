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
    throw new Error(`[subscribeAllClub] ${e}`);
  }
}

async function createClub(props: ClubFormFields) {
  const clubFields: CreateClubFields = {
    name: props.name,
    officeId: props.office.value,
    contact: props.contact,
    description: props.description,
    logoId: props.logoFile,
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
    throw new Error("[createClub]: " + e);
  }
}

async function updateClub(props: ClubFormFields, id: string) {
  try {
    const clubRef = doc(clubCollection, id);
    const clubDoc = await getDoc(clubRef);
    if (!clubDoc.exists()) {
      throw "Cet élément n'existe pas";
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
          deleteObject(ref(assetsRef, clubData.logoId));
        }
      }
    } else {
      if (clubData.logoId) {
        deleteObject(ref(imgPostRef, clubData.logoId));
      }
    }
    await updateDoc(clubRef, updatedFields);
  } catch (e) {
    throw new Error("[updateClub]: " + e);
  }
}

async function deleteClub(id: string) {
  try {
    const clubRef = doc(clubCollection, id);
    const clubDoc = await getDoc(clubRef);
    if (clubDoc.exists()) {
      const clubData = clubDoc.data() as FirestoreClub;
      if (clubData.logoId) {
        deleteObject(ref(imgClubPartnerRef, clubData.logoId));
      }
      await deleteDoc(clubRef);
    }
  } catch (e) {
    throw new Error("[delete club]: " + e);
  }
}

export { subscribeAllClub, createClub, updateClub, deleteClub };
