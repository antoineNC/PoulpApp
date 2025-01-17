import { getApp } from "firebase/app";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";

const app = getApp();
const db = getFirestore(app);
const userCollection = collection(db, "Users");

async function getCurrentUser(id: string) {
  try {
    const userRef = await getDoc(doc(userCollection, id));
    if (!userRef.exists()) {
      throw new Error("auth/no-data");
    }
    const { role } = userRef.data();
    return { role, userId: userRef.id };
  } catch (e) {
    throw e;
  }
}

export { getCurrentUser };
