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
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  DocumentData,
  setDoc,
  orderBy,
  onSnapshot,
} from "@firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { DocumentReference } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import app from "firebase/firebase.config";
import { fb_Club, fb_Post } from "./firebase.types";

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const userCollection = collection(db, "Users");
const postCollection = collection(db, "Post");
const bureauCollection = collection(db, "Bureau");
const clubCollection = collection(db, "Club");

const storage = getStorage();
const assetsRef = ref(storage, "Assets");

const subscribeUserState = (observer: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => observer(user));
};

// ===== AUTHENTICATION =====
const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user.uid;
  } catch (e: any) {
    throw Error(e);
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
}): Promise<string> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;
    await setDoc(doc(userCollection, user.uid), {
      id: user.uid,
      mail: user.email,
      role: Role.STUDENT_ROLE,
      firstName,
      lastName,
      adhesion: [],
    });
    const docSnap = await getDoc(doc(userCollection, user.uid));
    if (!docSnap.exists()) {
      throw Error("Le compte n'a pas bien été enregistré.");
    }
    return user.uid;
  } catch (e: any) {
    throw Error(e);
  }
};

const signout = () => {
  signOut(auth);
};

const getRole = (role: string) => {
  const upperCaseRole = role.toUpperCase();
  switch (upperCaseRole) {
    case "STUDENT":
      return Role.STUDENT_ROLE;
    case "OFFICE":
      return Role.OFFICE_ROLE;
    case "ADMIN":
      return Role.ADMIN_ROLE;
    default:
      return Role.STUDENT_ROLE;
  }
};

const getUser = async (id: string): Promise<UserType> => {
  try {
    const userRef = await getDoc(doc(userCollection, id));
    if (!userRef.exists()) {
      throw Error("Informations incorrectes.");
    }
    const userData = userRef.data();
    const userRole = getRole(userData.role);
    const user: UserType = {
      id: id,
      mail: userData.mail,
      role: userRole,
    };
    return user;
  } catch (e: any) {
    throw Error(e);
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

// ===== OFFICE =====

const getOneOffice = async (ref: DocumentReference) => {
  try {
    const docSnapshot = await getDoc(ref);
    if (!docSnapshot.exists()) {
      throw Error("Ce bureau n'existe pas.");
    }
    return docSnapshot.data() as OfficeType;
  } catch (e: any) {
    throw Error("Une erreur est survenue.\n" + e);
  }
};

const getAllOffice = async () => {
  try {
    const q = query(userCollection, where("role", "==", "office"));
    const querySnapshot = await getDocs(q);
    const bureaux: OfficeType[] = [];
    querySnapshot.forEach((bureau) => {
      bureaux.push(bureau.data() as OfficeType);
    });
    return bureaux;
  } catch (e: any) {
    throw Error("Une erreur est survenue.\n" + e);
  }
};

// const getOfficeLogo = async (office: string) => {
//   const logoRef = ref(assetsRef, `/${office.toUpperCase()}.png`);
//   try {
//     const url = await getDownloadURL(logoRef);
//     return url;
//   } catch (error: any) {
//     // A full list of error codes is available at
//     // https://firebase.google.com/docs/storage/web/handle-errors
//     switch (error.code) {
//       case "storage/object-not-found":
//         // File doesn't exist
//         break;
//       case "storage/unauthorized":
//         // User doesn't have permission to access the object
//         break;
//       case "storage/canceled":
//         // User canceled the upload
//         break;

//       case "storage/unknown":
//         // Unknown error occurred, inspect the server response
//         break;
//     }
//   }
// };

// ===== POSTS =====

const getAllPosts = (setPosts: (state: Post[]) => void) => {
  try {
    const q = query(postCollection, orderBy("createdAt", "desc"));
    return onSnapshot(q, async (snapshot) => {
      const posts = snapshot.docs.map(async (doc) => {
        const data = doc.data() as fb_Post;
        const office = await getOneOffice(data.editor);
        const post: Post = {
          id: doc.id,
          editorLogo: office.logo,
          ...data,
        };
        return post;
      });
      return setPosts(await Promise.all(posts));
    });
  } catch (e: any) {
    throw Error("Une erreur est survenue.\n" + e);
  }
};

const getEventPosts = (setPosts: (state: Post[]) => void) => {
  try {
    const q = query(
      postCollection,
      where("visibleCal", "==", true),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, async (snapshot) => {
      const posts = snapshot.docs.map(async (doc) => {
        const data = doc.data() as fb_Post;
        const office = await getOneOffice(data.editor);
        const post: Post = {
          id: doc.id,
          editorLogo: office.logo,
          ...data,
        };
        return post;
      });
      return setPosts(await Promise.all(posts));
    });
  } catch (e: any) {
    throw Error("Une erreur est survenue.\n" + e);
  }
};

// ===== CLUBS =====

// const getAllClubs = async () => {
//   const querySnapshot = await getDocs(clubCollection);
//   const clubs = querySnapshot.docs.map((doc) => {
//     const data = doc.data() as fb_Club;
//     const office = getId(data.office);
//     return { ...data, office: office };
//   });
//   return clubs;
// };

export {
  subscribeUserState,
  login,
  signup,
  signout,
  getUser,
  updateMail,
  updateInfo,
  getAllPosts,
  getEventPosts,
  getAllOffice,
};
