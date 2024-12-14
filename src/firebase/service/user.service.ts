import { getApp } from "firebase/app";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { Role } from "types/session.type";

const app = getApp();
const db = getFirestore(app);
const userCollection = collection(db, "Users");

async function getCurrentUser(
  id: string
): Promise<{ role: Role; userId: string }> {
  try {
    const userRef = await getDoc(doc(userCollection, id));
    if (!userRef.exists()) {
      throw "Informations incorrectes.";
    }
    const { role } = userRef.data();
    return { role, userId: userRef.id };
  } catch (e) {
    throw new Error(`[getCurrentUser] ${e}`);
  }
}

export { getCurrentUser };
