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
import { Club, ClubFieldNames } from "@types";
import { storageUrl } from "@fb-config";
import { formattedToday } from "utils/dateUtils";

const app = getApp();
const db = getFirestore(app);
const clubCollection = collection(db, "Club");

function subscribeAllClub(setState: (clubList: Club[]) => void) {
  try {
    return onSnapshot(clubCollection, async (snapshot) => {
      const clubList = snapshot.docs.map(async (clubDoc) => {
        const clubData = clubDoc.data();
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
  } catch (e: any) {
    throw new Error(`[subscribeAllClub] ${e}`);
  }
}

async function createClub(props: ClubFieldNames) {
  const clubFields = {
    name: props.name,
    officeId: props.office.value,
    contact: props.contact || "",
    description: props.description || "",
    logoId: props.logoFile || "",
  };
  try {
    if (props.logoFile) {
      const today = formattedToday();
      const name = await uploadImage(
        props.logoFile,
        `${today}_club_`,
        imgClubPartnerRef
      );
      clubFields["logoId"] = name;
    }
    await addDoc(clubCollection, clubFields);
  } catch (e) {
    throw new Error("[createClub]: " + e);
  }
}

async function updateClub(props: ClubFieldNames, id: string) {
  try {
    const clubRef = doc(clubCollection, id);
    const clubDoc = await getDoc(clubRef);
    if (!clubDoc.exists()) {
      throw "Cet élément n'existe pas";
    }
    const updatedFields = {
      name: props.name,
      officeId: props.office.value,
      contact: props.contact || "",
      description: props.description || "",
      logoId: props.logoFile || "",
    };

    const clubData = clubDoc.data();
    if (props.logoFile) {
      if (!props.logoFile.startsWith(storageUrl)) {
        const today = formattedToday();
        const name = await uploadImage(
          props.logoFile,
          `${today}_club_`,
          imgClubPartnerRef
        );
        updatedFields["logoId"] = name;
        if (clubData.logoId) {
          deleteObject(ref(assetsRef, clubData.logoId));
        }
      } else {
        delete updatedFields.logoId;
      }
    } else {
      updatedFields["logoId"] = "";
      if (clubData?.logoId) {
        deleteObject(ref(imgPostRef, clubData?.logoId));
      }
    }
    await updateDoc(clubRef, updatedFields);
  } catch (e) {
    console.error("[updateClub]", e);
  }
}

async function deleteClub(id: string) {
  try {
    const clubRef = doc(clubCollection, id);
    const snapshot = await getDoc(clubRef);
    if (snapshot.exists()) {
      const clubData = snapshot.data();
      if (clubData?.logoId) {
        deleteObject(ref(imgClubPartnerRef, clubData?.logoId));
      }
      await deleteDoc(clubRef);
    }
  } catch (e) {
    throw new Error("[delete club]: " + e);
  }
}

export { subscribeAllClub, createClub, updateClub, deleteClub };
