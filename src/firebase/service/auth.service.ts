import { auth } from "@fb-config";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getCurrentUser } from "./user.service";
import { createStudent } from "./student.service";
import Constants from "expo-constants";

function subscribeUserState(observer: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => observer(user));
}

async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return await getCurrentUser(userCredential.user.uid);
  } catch (e) {
    throw e;
  }
}

async function registerUser({
  firstName,
  lastName,
  email,
  password,
  code,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  code: string;
}) {
  try {
    if (code !== Constants.expoConfig?.extra?.codeENSC) {
      throw new Error("register/invalid-code");
    }
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await createStudent(
      { firstName, lastName, mail: email },
      userCredential.user.uid
    );
    return await getCurrentUser(userCredential.user.uid);
  } catch (e) {
    throw e;
  }
}

async function signOutUser() {
  try {
    if (auth) await signOut(auth);
  } catch (e) {
    console.error("Error signing out: ", e);
    throw e;
  }
}

export { subscribeUserState, loginUser, registerUser, signOutUser };
