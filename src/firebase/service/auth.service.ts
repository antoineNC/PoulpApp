import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import Constants from "expo-constants";

import { auth } from "@fb-config";
import { getCurrentUser } from "@fb/service/user.service";
import { createStudent } from "@fb/service/student.service";

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
      throw new Error("auth/invalid-code");
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

async function forgotPassword({ email }: { email: string }) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
}

async function signOutUser() {
  try {
    if (auth) await signOut(auth);
  } catch (e) {
    throw e;
  }
}

export {
  subscribeUserState,
  loginUser,
  registerUser,
  forgotPassword,
  signOutUser,
};
