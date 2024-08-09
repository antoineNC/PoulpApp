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
  updateDoc,
  query,
  where,
  setDoc,
  orderBy,
  onSnapshot,
  DocumentSnapshot,
  getDocs,
  limit,
  QuerySnapshot,
  startAfter,
} from "@firebase/firestore";
import {
  StorageReference,
  getDownloadURL,
  getStorage,
  ref,
} from "@firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

import app from "firebase/firebase.config";
import { actionSession } from "@context/sessionStore";
import { actionOffice } from "@context/officeStore";
import { actionStudent } from "@context/studentStore";

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
const assetsRef = ref(storage, "Assets");
const imgPostRef = ref(storage, "ImgPosts");
const imgClubPartnerRef = ref(storage, "ImgClubPartenariat");

export const subscribeUserState = (observer: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => observer(user));
};
/*Eventually useful */

// const createQuery = (
//   collection: CollectionReference,
//   filter?: {
//     limit?: number;
//     startAfter?: DocumentSnapshot;
//     where?: {
//       field: string | FieldPath;
//       operation: WhereFilterOp;
//       value: unknown;
//     }[];
//     order?: {
//       field: string | FieldPath;
//       direction: OrderByDirection;
//     };
//   }
// ) => {
//   const queryConstraints: QueryConstraint[] = [];
//   if (filter) {
//     if (filter.where?.length) {
//       filter.where.forEach((element) =>
//         queryConstraints.push(
//           where(element.field, element.operation, element.value)
//         )
//       );
//     }
//     if (filter.order)
//       queryConstraints.push(
//         orderBy(filter.order.field, filter.order.direction)
//       );
//     if (filter.startAfter) queryConstraints.push(startAfter(filter.startAfter));
//     if (filter.limit) queryConstraints.push(limit(filter.limit));
//   }
//   return query(collection, ...queryConstraints);
// };

export const useUtils = () => {
  const getImgURL = async (storageRef: StorageReference, id: string) => {
    const imgRef = ref(storageRef, `/${id}`);
    try {
      const url = await getDownloadURL(imgRef);
      return url;
    } catch (error: any) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/object-not-found":
          // File doesn't exist
          break;
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
      return undefined;
    }
  };
  return { getImgURL };
};

export const useAuth = () => {
  const { getAllOffice, getAllClub, getAllPartnership, getAllRole } =
    useOffice();
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
  // const getAllStudent = async (getSnapshot: (snapshot: Student[]) => void) => {
  //   try {
  //     const q = query(userCollection, where("role", "==", "STUDENT_ROLE"));
  //     onSnapshot(q, async (snapshot) => {
  //       const allStudent = snapshot.docs.map(async (doc) => {
  //         const studentData = doc.data();
  //         const student: Student = {
  //           id: doc.id,
  //           mail: studentData.mail,
  //           firstName: studentData.firstName,
  //           lastName: studentData.lastName,
  //           adhesion: studentData.adhesion,
  //         };
  //         return student;
  //       });
  //       const allStudentResolved = await Promise.all(allStudent);
  //       actionStudent.setAllStudent(allStudentResolved);
  //     });
  //   } catch (e: any) {
  //     throw Error(`[getAllStudent] ${e}\n`);
  //   }
  // };

  const getStudentById = async (id: string) => {
    try {
      const snapshot = await getDoc(doc(userCollection, id));
      if (!snapshot.exists()) {
        throw Error(`L'étudiant.e ${id} n'existe pas.`);
      }
      if (snapshot.data().role !== "STUDENT_ROLE") {
        throw Error(`L'étudiant.e ${id} n'existe pas.`);
      }
      const student: Student = {
        id: snapshot.id,
        firstName: snapshot.data().firstName,
        lastName: snapshot.data().lastName,
        mail: snapshot.data().mail,
      };
      return student;
    } catch (e) {
      console.error(e);
    }
  };
  return { getStudentById };
};

export const useOffice = () => {
  const { getImgURL } = useUtils();
  const getAllOffice = async () => {
    try {
      const q = query(userCollection, where("role", "==", "OFFICE_ROLE"));
      // TODO : transform to a get function
      onSnapshot(q, async (snapshot) => {
        const allOffice = snapshot.docs.map(async (doc) => {
          const officeData = doc.data();
          const logo = await getImgURL(
            assetsRef,
            `${officeData.acronym.toLowerCase()}.png`
          );
          const office: Office = {
            id: doc.id,
            name: officeData.name,
            acronym: officeData.acronym,
            description: officeData.description,
            mail: officeData.mail,
            members: officeData.members,
            clubs: officeData.clubs,
            partnerships: officeData.partnerships,
            logoUrl: logo || require("@assets/no_image_available.jpg"),
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

  const getAllClub = async () => {
    try {
      onSnapshot(clubCollection, async (snapshot) => {
        const clubList = snapshot.docs.map(async (doc) => {
          const clubData = doc.data();
          const logoUrl = await getImgURL(imgClubPartnerRef, clubData.logoId);
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

  const getAllPartnership = async () => {
    try {
      onSnapshot(partnerCollection, async (snapshot) => {
        const partnerList = snapshot.docs.map(async (doc) => {
          const partnerData = doc.data();
          const logoUrl = await getImgURL(
            imgClubPartnerRef,
            partnerData.logoId
          );
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

  return { getAllOffice, getAllClub, getAllPartnership, getAllRole };
};

export const usePost = () => {
  const { getImgURL } = useUtils();
  const postMapping = async (snapshot: QuerySnapshot) => {
    const postList = snapshot.docs.map(async (doc) => {
      const postData = doc.data();
      const imageURL =
        postData.imageId && (await getImgURL(imgPostRef, postData.imageId));
      const post: Post = {
        id: doc.id,
        title: postData.title,
        description: postData.description,
        editorId: postData.editorId,
        imageUrl: imageURL,
        createdAt: postData.createdAt.toDate(),
        date: postData.date && {
          start: postData.date.start.toDate(),
          end: postData.date.end.toDate(),
        },
      };
      return post;
    });
    return Promise.all(postList);
  };

  const getAllPost = async () => {
    try {
      const q = query(postCollection, orderBy("createdAt", "desc"), limit(10));
      const snapshot = await getDocs(q);
      const postList = await postMapping(snapshot);
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      return { postList, lastVisible };
    } catch (e: any) {
      console.log(`[getAllPost] ${e}\n`);
      throw e;
    }
  };

  const getMorePost = async (lastVisible: DocumentSnapshot) => {
    try {
      const q = query(
        postCollection,
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const postList = await postMapping(snapshot);
      const newLastVisible = snapshot.docs[snapshot.docs.length - 1];
      return { postList, newLastVisible };
    } catch (e: any) {
      console.log(`[getMorePost] ${e}\n`);
      throw e;
    }
  };

  return { getAllPost, getMorePost };
};
