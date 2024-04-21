import {
  User,
  getAuth,
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
  addDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import app from "firebase/firebaseConfig";

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const userCollection = collection(db, "Users");
const postCollection = collection(db, "Post");
const bureauCollection = collection(db, "Bureau");

const subscribeUserState = (observer: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => observer(user));
};

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

const getUserRole = async (uid: string) => {
  try {
    const userRef = await getDoc(doc(userCollection, uid));
    if (userRef.exists()) {
      const user = userRef.data();
      return user;
    } else throw Error("Utilisateur inconnu");
  } catch (e: any) {
    throw Error(e);
  }
};

const signout = () => {
  signOut(auth);
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

const getPosts = async () => {
  try {
    const posts = await getDocs(postCollection);
    return posts;
  } catch (e: any) {
    throw Error("Une erreur est survenue.\n" + e);
  }
};

const getBureaux = async () => {
  try {
    const q = query(userCollection, where("role", "==", "office"));
    const querySnapshot = await getDocs(q);
    const bureaux: OfficeType[] = [];
    querySnapshot.forEach((bureau) => {
      // doc.data() is never undefined for query doc snapshots
      bureaux.push(bureau.data() as OfficeType);
    });
    return bureaux;
  } catch (e: any) {
    throw Error("Une erreur est survenue.\n" + e);
  }
};

export {
  subscribeUserState,
  login,
  signup,
  signout,
  getUserRole,
  updateMail,
  updateInfo,
  getPosts,
  getBureaux,
};
