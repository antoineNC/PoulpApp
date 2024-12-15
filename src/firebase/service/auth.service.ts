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
import { actionPost } from "@context/postStore";
import { actionStudent } from "@context/studentStore";
import { actionCalendar } from "@context/calendar.store";
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
    return getCurrentUser(userCredential.user.uid);
  } catch (e: any) {
    throw new Error(`[login] ${e}`);
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
      throw new Error("Code incorrect");
    }
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await createStudent(
      {
        firstName,
        lastName,
        mail: email,
      },
      userCredential.user.uid
    );
    return getCurrentUser(userCredential.user.uid);
  } catch (e: any) {
    throw new Error(`[signup] ${e}`);
  }
}

async function signoutUser() {
  actionPost.logout();
  actionStudent.logout();
  actionCalendar.logout();
  await signOut(auth);
}

export { subscribeUserState, loginUser, registerUser, signoutUser };
