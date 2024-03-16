import { getFirestore, collection, getDocs } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import app from "firebase/config";

const auth = getAuth(app);
const db = getFirestore(app);
const postCollection = collection(db, "Post");
const bureauCollection = collection(db, "Bureau");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (e: any) {
    throw Error(e.code + " " + e.message);
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
    const bureaux = await getDocs(bureauCollection);
  } catch (e: any) {
    throw Error("Une erreur est survenue.\n" + e);
  }
};

export { login, getPosts, getBureaux };
