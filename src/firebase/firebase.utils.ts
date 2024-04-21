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
import { fb_Post } from "firebase/firebase.types";
import { OfficeType, Post } from "@types";

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const userCollection = collection(db, "Users");
const postCollection = collection(db, "Post");
const bureauCollection = collection(db, "Bureau");

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
}): Promise<DocumentData> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;
    const docSnap = await getDoc(doc(userCollection, userId));
    if (!docSnap.exists()) {
      throw Error("Informations incorrectes.");
    }
    const user = { id: userId, ...docSnap.data() };
    return user;
  } catch (e: any) {
    throw Error(e);
  }
};

const signup = async ({
  firstname,
  lastName,
  email,
  password,
}: {
  firstname: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<DocumentData> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await setDoc(doc(userCollection, user.uid), {
      firstname,
      lastName,
      mail: user.email,
      role: "student",
    });
    const docSnap = await getDoc(doc(userCollection, user.uid));
    if (!docSnap.exists()) {
      throw Error("Le compte n'a pas bien été enregistré.");
    }
    return docSnap.data();
  } catch (e: any) {
    throw Error(e);
  }
};

const signout = () => {
  signOut(auth);
};

const getUserData = async (id: string) => {
  try {
    const userRef = await getDoc(doc(userCollection, id));
    if (!userRef.exists()) {
      throw Error("Utilisateur inconnu");
    }
    const userData = userRef.data();
    return userData;
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

const getOfficeLogo = async (office: string) => {
  const logoRef = ref(assetsRef, `/${office.toUpperCase()}.png`);
  try {
    const url = await getDownloadURL(logoRef);
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
  }
};

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

export {
  subscribeUserState,
  login,
  signup,
  signout,
  getUserData,
  updateMail,
  updateInfo,
  getAllPosts,
  getEventPosts,
  getAllOffice,
  getOfficeLogo,
};
