import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import { getCurrentUser } from "./user.service";
import { createStudent } from "./student.service";

const auth = getAuth();

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
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await createStudent({
      id: userCredential.user.uid,
      firstName,
      lastName,
      mail: email,
    });
    return getCurrentUser(userCredential.user.uid);
  } catch (e: any) {
    throw new Error(`[signup] ${e}`);
  }
}

async function signoutUser() {
  await signOut(auth);
}

export { subscribeUserState, loginUser, registerUser, signoutUser };
