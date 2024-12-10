import { Student } from "@types";
import { getApp } from "firebase/app";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const app = getApp();
const db = getFirestore(app);
const userCollection = collection(db, "Users");

function subscribeAllStudent(setState: (studentList: Student[]) => void) {
  try {
    const q = query(userCollection, where("role", "==", "STUDENT"));
    return onSnapshot(q, async (snapshot) => {
      const allStudent = snapshot.docs.map((studentDoc) => {
        const studentData = studentDoc.data();
        const student: Student = {
          id: studentDoc.id,
          mail: studentData.mail,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          adhesion: studentData.adhesion,
        };
        return student;
      });
      setState(allStudent);
    });
  } catch (e: any) {
    throw new Error(`[subscribeAllStudent] ${e}`);
  }
}

async function getStudent(id: string) {
  try {
    const studentDoc = await getDoc(doc(userCollection, id));
    if (!studentDoc.exists()) {
      throw Error(`L'étudiant.e ${id} n'existe pas.`);
    }
    const studentData = studentDoc.data();
    if (studentData.role !== "STUDENT") {
      throw Error(`L'étudiant.e ${id} n'existe pas.`);
    }
    const student: Student = {
      id: studentDoc.id,
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      mail: studentData.mail,
      adhesion: studentData.adhesion,
    };
    return student;
  } catch (e) {
    throw new Error("[get student] " + e);
  }
}

async function createStudent({
  id,
  firstName,
  lastName,
  mail,
}: {
  id: string;
  firstName: string;
  lastName: string;
  mail: string;
}) {
  try {
    await setDoc(doc(userCollection, id), {
      firstName,
      lastName,
      mail,
      role: "STUDENT",
      adhesion: [],
    });
  } catch (e) {
    throw new Error("[Create student] " + e);
  }
}

async function updateStudentAdhesion(
  officeId: string,
  studentId: string,
  isNowAdherent: boolean
) {
  try {
    const studentRef = doc(userCollection, studentId);
    const studentDoc = await getDoc(studentRef);
    if (!studentDoc.exists()) {
      throw Error(`L'étudiant.e ${studentId} n'existe pas.`);
    }
    const hasChanged =
      (studentDoc.data().adhesion?.includes(officeId) && !isNowAdherent) ||
      (!studentDoc.data().adhesion?.includes(officeId) && isNowAdherent);

    if (hasChanged) {
      if (isNowAdherent) {
        await updateDoc(studentRef, { adhesion: arrayUnion(officeId) });
      } else {
        await updateDoc(studentRef, {
          adhesion: arrayRemove(officeId),
        });
      }
    }
  } catch (e) {
    console.error("[set student adhesion]", e);
  }
}

export {
  subscribeAllStudent,
  getStudent,
  createStudent,
  updateStudentAdhesion,
};
