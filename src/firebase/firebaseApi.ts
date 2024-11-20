import {
  User,
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  createUserWithEmailAndPassword,
} from "@firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  DocumentSnapshot,
  QuerySnapshot,
  startAfter,
  QueryConstraint,
  Timestamp,
  deleteField,
} from "@firebase/firestore";
import {
  StorageReference,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
} from "@firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import app from "firebase/firebaseConfig";
import { actionSession } from "@context/sessionStore";
import { actionOffice } from "@context/officeStore";
import { actionPost } from "@context/postStore";
import { actionStudent } from "@context/studentStore";
import {
  Club,
  ClubFieldNames,
  fb_Club,
  fb_Office,
  fb_Partnership,
  fb_Post,
  Office,
  OfficeFieldNames,
  Partnership,
  PartnershipFieldNames,
  Post,
  RoleOffice,
  Student,
  UserType,
} from "@types";
import { PostFieldNames } from "@types";
import { storageUrl } from "data";
import { formattedToday } from "utils/dateUtils";

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const userCollection = collection(db, "Users");
const postCollection = collection(db, "Post");
const clubCollection = collection(db, "Club");
const partnerCollection = collection(db, "Partnership");
const roleCollection = collection(db, "RoleBureau");

const storage = getStorage();
const rootRef = ref(storage);
const assetsRef = ref(storage, "Assets");
const imgPostRef = ref(storage, "ImgPosts");
const imgClubPartnerRef = ref(storage, "ImgClubPartenariat");

export const subscribeUserState = (observer: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => observer(user));
};

export const useUtils = () => {
  const getImgURL = async (storageRef: StorageReference, id: string) => {
    try {
      const imgRef = ref(storageRef, `/${id}`);
      const url = await getDownloadURL(imgRef);
      return url;
    } catch (error: any) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/object-not-found":
          // File doesn't exist
          return undefined;
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;
        case "storage/unknown":
          // Unknown error occurred, inspect the server response
          break;
      }
    }
  };

  const uploadImage = async (
    localUri: string,
    name: string,
    storageRef: StorageReference
  ) => {
    try {
      const result = await fetch(localUri);
      const imgBlob = await result.blob();
      const fileName = name + uuid.v4();
      const fileRef = ref(storageRef, fileName);
      await uploadBytes(fileRef, imgBlob);
      return fileName;
    } catch (e) {
      console.error("[uploadImage]", e);
    }
  };
  return { getImgURL, uploadImage };
};

export const useAuth = () => {
  const { getAllOffice, getAllRole } = useOffice();
  const { getAllClub } = useClub();
  const { getAllPartnership } = usePartnership();
  const { getAllStudent } = useStudent();

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await loginHandle(userCredential.user.uid);
    } catch (e: any) {
      throw Error(`[login] ${e}\n`);
    }
  };

  const signup = async ({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(userCollection, userCredential.user.uid), {
        id: userCredential.user.uid,
        mail: userCredential.user.email,
        role: "student",
        firstName,
        lastName,
        adhesion: [],
      });
      const { user, role } = await getCurrentUser(
        userCredential.user.uid,
        "Le compte n'a pas bien été enregistré."
      );
      actionSession.login({ user, role });
    } catch (e: any) {
      throw Error(`[signup] ${e}\n`);
    }
  };

  const signout = () => {
    actionOffice.logout();
    actionSession.logout();
    signOut(auth);
  };

  const getCurrentUser = async (id: string, errExist?: string) => {
    try {
      const userRef = await getDoc(doc(userCollection, id));
      if (!userRef.exists()) {
        throw Error(errExist || "Informations incorrectes.");
      }
      const userData = userRef.data();
      const { mail, role } = userData;
      const user: UserType = {
        id,
        mail,
      };
      return { user, role };
    } catch (e: any) {
      throw Error(`[getCurrentUser] ${e}\n`);
    }
  };

  const updateMail = async (id: string, mail: string) => {
    const user = auth.currentUser;
    if (user) {
      try {
        updateEmail(user, mail);
        await updateDoc(doc(userCollection, id), { mail });
        return mail;
      } catch (e: any) {
        throw Error("Une erreur est survenue. " + e);
      }
    }
    throw Error("Vous n'êtes plus connecté.");
  };

  const updateInfo = async (id: string, info: any) => {
    try {
      const docRef = doc(userCollection, id);
      await updateDoc(docRef, { ...info });
    } catch (e: any) {
      throw Error("");
    }
  };

  const loginHandle = async (id: string) => {
    const { user, role } = await getCurrentUser(id);
    await getAllOffice();
    await getAllClub();
    await getAllPartnership();
    await getAllRole();
    if (role !== "STUDENT") {
      await getAllStudent();
    }
    actionSession.login({ user, role });
  };

  return {
    login,
    signup,
    signout,
    updateMail,
    updateInfo,
    getCurrentUser,
    loginHandle,
  };
};

export const useStudent = () => {
  const getAllStudent = async () => {
    try {
      const q = query(userCollection, where("role", "==", "STUDENT"));
      onSnapshot(q, async (snapshot) => {
        const allStudent = snapshot.docs.map((doc) => {
          const studentData = doc.data();
          const student: Student = {
            id: doc.id,
            mail: studentData.mail,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            adhesion: studentData.adhesion,
          };
          return student;
        });
        actionStudent.setAllStudent(allStudent);
      });
    } catch (e: any) {
      throw Error(`[getAllStudent] ${e}\n`);
    }
  };

  // const getMemberOffice = async (idOffice: string) => {
  //   try {
  //     const q = query(
  //       userCollection,
  //       where("role", "==", "STUDENT"),
  //       where("memberOf", "array-contains", idOffice)
  //     );
  //     const snapshot = await getDocs(q);
  //     const members: Student[] = snapshot.docs.map((student) => {
  //       const studentData = student.data();
  //       return {
  //         id: student.id,
  //         mail: studentData.mail,
  //         firstName: studentData.firstName,
  //         lastName: studentData.lastName,
  //         adhesion: studentData.adhesion,
  //         memberOf: studentData.memberOf,
  //       };
  //     });
  //     return members;
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const getStudent = async (id: string) => {
    try {
      const snapshot = await getDoc(doc(userCollection, id));
      if (!snapshot.exists()) {
        throw Error(`L'étudiant.e ${id} n'existe pas.`);
      }
      const studentData = snapshot.data();
      if (studentData.role !== "STUDENT") {
        throw Error(`L'étudiant.e ${id} n'existe pas.`);
      }
      const student: Student = {
        id: snapshot.id,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        mail: studentData.mail,
      };
      return student;
    } catch (e) {
      console.error(e);
    }
  };
  return { getAllStudent, getStudent };
};

export const useOffice = () => {
  const { getImgURL, uploadImage } = useUtils();
  const getAllOffice = async () => {
    try {
      const q = query(
        userCollection,
        where("role", "in", ["BDE", "BDS", "BDA", "I2C"])
      );
      onSnapshot(q, async (snapshot) => {
        const allOffice = snapshot.docs.map(async (doc) => {
          const officeData = doc.data() as fb_Office;
          const logoUrl =
            officeData.logoId &&
            (await getImgURL(assetsRef, officeData.logoId));
          const office: Office = {
            id: doc.id,
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
        actionOffice.setAllOffice(allOfficeResolved);
      });
    } catch (e: any) {
      throw Error(`[getAllOffice] ${e}\n`);
    }
  };

  const updateOffice = async (props: OfficeFieldNames, id: string) => {
    try {
      const officeRef = doc(userCollection, id);
      const snapshot = await getDoc(officeRef);
      if (!snapshot.exists()) {
        throw "Cet élément n'existe pas";
      }
      const officeData = snapshot.data() as fb_Office;
      const updatedFields: fb_Office = {
        acronym: props.acronym,
        name: props.name,
        mail: props.mail,
        description: props.description || "",
        logoId: props.logoFile || "",
        members: props.members || [],
      };
      if (props.logoFile) {
        if (!props.logoFile.startsWith(storageUrl)) {
          const name = await uploadImage(
            props.logoFile,
            officeData.acronym.toLowerCase(),
            assetsRef
          );
          updatedFields["logoId"] = name;
          if (officeData.logoId) {
            deleteObject(ref(assetsRef, officeData.logoId));
          }
        } else {
          delete updatedFields.logoId;
        }
      } else {
        updatedFields["logoId"] = "";
        if (officeData?.logoId) {
          deleteObject(ref(imgPostRef, officeData?.logoId));
        }
      }
      await updateDoc(officeRef, updatedFields);
    } catch (e) {
      console.error("[updateOffice]", e);
    }
  };

  const getAllRole = async () => {
    try {
      onSnapshot(roleCollection, async (snapshot) => {
        const allRole = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as RoleOffice)
        );
        actionOffice.setAllRole(allRole);
      });
    } catch (e) {}
  };

  return {
    getAllOffice,
    updateOffice,
    getAllRole,
  };
};

export const useClub = () => {
  const { uploadImage, getImgURL } = useUtils();
  const getClub = async (id: string) => {
    try {
      const snapshot = await getDoc(doc(clubCollection, id));
      if (!snapshot.exists()) {
        throw Error(`Le club avec l'${id} n'existe pas.`);
      }
      const clubData = snapshot.data();
      const logoUrl = await getImgURL(imgClubPartnerRef, clubData.logoId);

      const club: Club = {
        id: snapshot.id,
        name: clubData.name,
        officeId: clubData.officeId,
        logoUrl,
        description: clubData.description,
        contact: clubData.contact,
      };
      return club;
    } catch (e) {
      throw Error(`[getClub] ${e}\n`);
    }
  };

  const getAllClub = async () => {
    try {
      onSnapshot(clubCollection, async (snapshot) => {
        const clubList = snapshot.docs.map(async (doc) => {
          const clubData = doc.data() as fb_Club;
          const logoUrl =
            clubData.logoId &&
            (await getImgURL(imgClubPartnerRef, clubData.logoId));
          const club: Club = {
            id: doc.id,
            name: clubData.name,
            officeId: clubData.officeId,
            logoUrl,
            description: clubData.description,
            contact: clubData.contact,
          };
          return club;
        });
        const clubListResolved = await Promise.all(clubList);
        actionOffice.setAllClub(clubListResolved);
      });
    } catch (e: any) {
      throw Error(`[getAllClub] ${e}\n`);
    }
  };

  const createClub = async (props: ClubFieldNames) => {
    const clubFields: fb_Club = {
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
      const clubRef = await addDoc(clubCollection, clubFields);
      return clubRef.id;
    } catch (e) {
      console.error("[createClub]", e);
    }
  };

  const updateClub = async (props: ClubFieldNames, id: string) => {
    try {
      const clubRef = doc(clubCollection, id);
      const snapshot = await getDoc(clubRef);
      if (!snapshot.exists()) {
        throw "Cet élément n'existe pas";
      }
      const updatedFields: fb_Club = {
        name: props.name,
        officeId: props.office.value,
        contact: props.contact || "",
        description: props.description || "",
        logoId: props.logoFile || "",
      };

      const clubData = snapshot.data() as fb_Club;
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
  };

  const deleteClub = async (id: string) => {
    const clubRef = doc(clubCollection, id);
    const snapshot = await getDoc(clubRef);
    if (snapshot.exists()) {
      const clubData = snapshot.data() as fb_Club;
      if (clubData?.logoId) {
        deleteObject(ref(imgClubPartnerRef, clubData?.logoId));
      }
      await deleteDoc(clubRef);
    }
  };

  return { getAllClub, createClub, updateClub, deleteClub };
};

export const usePartnership = () => {
  const { uploadImage, getImgURL } = useUtils();
  const getAllPartnership = async () => {
    try {
      onSnapshot(partnerCollection, async (snapshot) => {
        const partnerList = snapshot.docs.map(async (doc) => {
          const partnerData = doc.data() as fb_Partnership;
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
        actionOffice.setAllPartnership(partnerListResolved);
      });
    } catch (e: any) {
      throw Error(`[getAllPartner] ${e}\n`);
    }
  };

  const createPartnership = async (props: PartnershipFieldNames) => {
    const partnerFields: fb_Partnership = {
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
      const partnerRef = await addDoc(partnerCollection, partnerFields);
      return partnerRef.id;
    } catch (e) {
      console.error("[createPartnership]", e);
    }
  };

  const updatePartnership = async (
    props: PartnershipFieldNames,
    id: string
  ) => {
    try {
      const partnerRef = doc(partnerCollection, id);
      const snapshot = await getDoc(partnerRef);
      if (!snapshot.exists()) {
        throw "Cet élément n'existe pas";
      }
      const partnerData = snapshot.data() as fb_Partnership;
      const updatedFields: fb_Partnership = {
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
      console.error("[updatePartner]", e);
    }
  };

  const deletePartnership = async (id: string) => {
    const partnerRef = doc(partnerCollection, id);
    const snapshot = await getDoc(partnerRef);
    if (snapshot.exists()) {
      const partnerData = snapshot.data() as fb_Partnership;
      if (partnerData?.logoId) {
        deleteObject(ref(imgClubPartnerRef, partnerData?.logoId));
      }
      await deleteDoc(partnerRef);
    }
  };
  return {
    getAllPartnership,
    createPartnership,
    updatePartnership,
    deletePartnership,
  };
};

export const usePost = () => {
  const { getImgURL, uploadImage } = useUtils();
  const postMapping = async (snapshot: QuerySnapshot) => {
    const postList = snapshot.docs.map(async (doc) => {
      const postData = doc.data() as fb_Post;
      const imageUrl =
        postData.imageId && (await getImgURL(imgPostRef, postData.imageId));
      const post: Post = {
        id: doc.id,
        title: postData.title,
        description: postData.description,
        editorId: postData.editorId,
        imageUrl,
        createdAt: postData.createdAt,
        tags: postData.tags,
        date: postData.date && {
          start: postData.date.start,
          end: postData.date.end,
        },
      };
      return post;
    });
    return Promise.all(postList);
  };

  const getMorePost = async (lastVisible?: DocumentSnapshot) => {
    try {
      const queryConstraints: QueryConstraint[] = [
        orderBy("createdAt", "desc"),
        // limit(3),
      ];
      if (lastVisible) queryConstraints.push(startAfter(lastVisible));
      const q = query(postCollection, ...queryConstraints);

      return onSnapshot(q, async (snap) => {
        const postList = await postMapping(snap);
        const lastVisible = snap.docs[snap.docs.length - 1];
        actionPost.setMorePost({
          posts: postList,
          lastVisible,
          loading: false,
        });
      });
      // const snapshot = await getDocs(q);
      // const postList = await postMapping(snapshot);
      // const newLastVisible = snapshot.docs[snapshot.docs.length - 1];
      // return { postList, newLastVisible };
    } catch (e: any) {
      console.error(`[getMorePost] ${e}\n`);
      throw e;
    }
  };

  const createPost = async (props: PostFieldNames) => {
    const postFields: fb_Post = {
      title: props.title,
      editorId: props.editor.value,
      createdAt: Timestamp.now(),
      ...(props.date && { date: props.date }),
      description: props.description || "",
      imageId: props.imageFile || "",
      tags: props.tags || [],
    };
    try {
      if (props.imageFile) {
        const name = await uploadImage(
          props.imageFile,
          `${postFields.createdAt.seconds}_`,
          imgPostRef
        );
        postFields["imageId"] = name;
      }
      const postRef = await addDoc(postCollection, postFields);
      return postRef.id;
    } catch (e) {
      console.error("[createPost]", e);
    }
  };

  const updatePost = async (props: PostFieldNames, id: string) => {
    try {
      const postRef = doc(postCollection, id);
      const snapshot = await getDoc(postRef);
      if (!snapshot.exists()) {
        throw "Cet élément n'existe pas";
      }
      const postData = snapshot.data() as fb_Post;
      const updatedFields: fb_Post = {
        title: props.title,
        editorId: props.editor.value,
        createdAt: postData.createdAt,
        date: props.date,
        description: props.description || "",
        imageId: props.imageFile || "",
        tags: props.tags || [],
      };
      if (props.imageFile) {
        if (!props.imageFile.startsWith(storageUrl)) {
          const today = Timestamp.now().seconds;
          const name = await uploadImage(
            props.imageFile,
            `${today}_`,
            imgPostRef
          );
          updatedFields["imageId"] = name;
          if (postData?.imageId) {
            deleteObject(ref(imgPostRef, postData?.imageId));
          }
        } else {
          delete updatedFields.imageId;
        }
      } else {
        updatedFields["imageId"] = "";
        if (postData?.imageId) {
          deleteObject(ref(imgPostRef, postData?.imageId));
        }
      }
      await updateDoc(postRef, {
        ...updatedFields,
        ...(!updatedFields.date && { date: deleteField() }),
      });
    } catch (e) {
      console.error("[updatepost]", e);
    }
  };

  const deletePost = async (idPost: string) => {
    const postRef = doc(postCollection, idPost);
    const snapshot = await getDoc(postRef);
    if (snapshot.exists()) {
      const postData = snapshot.data() as fb_Post;
      if (postData?.imageId) {
        deleteObject(ref(imgPostRef, postData?.imageId));
      }
      await deleteDoc(postRef);
    }
  };

  return { getMorePost, updatePost, deletePost, createPost };
};
