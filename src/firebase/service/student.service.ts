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
import {
  CreateStudentArgs,
  FirestoreStudent,
  Student,
} from "types/student.type";

const app = getApp();
const db = getFirestore(app);
const userCollection = collection(db, "Users");

function subscribeAllStudent(setState: (studentList: Student[]) => void) {
  try {
    const q = query(userCollection, where("role", "==", "STUDENT"));
    return onSnapshot(q, async (snapshot) => {
      const allStudent = snapshot.docs.map((studentDoc) => {
        const studentData = studentDoc.data() as FirestoreStudent;
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
  } catch (e) {
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

async function createStudent(props: CreateStudentArgs, userId: string) {
  try {
    await setDoc(doc(userCollection, userId), {
      ...props,
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
  isAdherent: boolean
) {
  try {
    const studentRef = doc(userCollection, studentId);
    const studentDoc = await getDoc(studentRef);
    if (!studentDoc.exists()) {
      throw Error(`L'étudiant.e ${studentId} n'existe pas.`);
    }
    if (isAdherent) {
      await updateDoc(studentRef, { adhesion: arrayUnion(officeId) });
    } else {
      await updateDoc(studentRef, {
        adhesion: arrayRemove(officeId),
      });
    }
  } catch (e) {
    throw new Error("[set student adhesion]: " + e);
  }
}

export {
  subscribeAllStudent,
  getStudent,
  createStudent,
  updateStudentAdhesion,
};
