import {
  User,
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
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  setDoc,
  orderBy,
  onSnapshot,
} from "@firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

import app from "firebase/firebase.config";
import { fb_Office, fb_Post, fb_Student } from "firebase/firebase.types";
import { actionSession } from "@context/sessionStore";
import { $officeStore, actionOffice } from "@context/officeStore";
import { actionPost } from "@context/postStore";
import { useUnit } from "effector-react";
import { actionStudent } from "@context/studentStore";

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const userCollection = collection(db, "Users");
const postCollection = collection(db, "Post");
const clubCollection = collection(db, "Club");

const storage = getStorage();
const assetsRef = ref(storage, "Assets");
const imgPostRef = ref(storage, "ImgPosts");
export const subscribeUserState = (observer: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => observer(user));
};

export const useAuth = () => {
  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await getCurrentUser(userCredential.user.uid);
    } catch (e: any) {
      throw Error(e);
    }
  };

  const signup = async ({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;
      await setDoc(doc(userCollection, user.uid), {
        id: user.uid,
        mail: user.email,
        role: "student",
        firstName,
        lastName,
        adhesion: [],
      });
      await getCurrentUser(user.uid, "Le compte n'a pas bien été enregistré.");
    } catch (e: any) {
      throw Error(e);
    }
  };

  const signout = () => {
    actionOffice.logout();
    actionSession.logout();
    signOut(auth);
  };

  const getCurrentUser = async (
    id: string,
    errExist?: string
  ): Promise<void> => {
    try {
      const userRef = await getDoc(doc(userCollection, id));
      if (!userRef.exists()) {
        throw Error(errExist || "Informations incorrectes.");
      }
      const userData = userRef.data();
      const user: UserType = {
        id: id,
        mail: userData.mail,
      };
      actionSession.login(user);
    } catch (e: any) {
      throw Error(e);
    }
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

  return {
    login,
    signup,
    signout,
    updateMail,
    updateInfo,
    getCurrentUser,
  };
};

export const useStudent = () => {
  const allOffice = useUnit($officeStore);
  const getAllStudent = async (getSnapshot: (snapshot: Student[]) => void) => {
    try {
      const q = query(userCollection, where("role", "==", "STUDENT_ROLE"));
      onSnapshot(q, async (snapshot) => {
        const allStudent = snapshot.docs.map(async (doc) => {
          const studentData = doc.data() as fb_Student;
          const officeAdherent = allOffice.filter((office) =>
            studentData.adhesion.includes(office.id)
          );
          const adhesion = officeAdherent.map((office) => ({
            id: office.id,
            acronym: office.acronym,
            logo: office.logo,
          }));
          const student: Student = {
            ...studentData,
            id: doc.id,
            adhesion,
          };
          return student;
        });
        const allStudentResolved = await Promise.all(allStudent);
        actionStudent.setAllStudent(allStudentResolved);
      });
    } catch (e: any) {
      throw Error("[getAllOffice]\n" + e);
    }
  };

  return { getAllStudent };
};

export const useOffice = () => {
  const getAllOffice = async (getSnapshot: (snapshot: Office[]) => void) => {
    try {
      const q = query(userCollection, where("role", "==", "OFFICE_ROLE"));
      return onSnapshot(q, async (snapshot) => {
        const allOffice = snapshot.docs.map(async (doc) => {
          const officeData = doc.data() as fb_Office;
          const logo = await getOfficeLogo(officeData.acronym.toLowerCase());
          const office: Office = {
            ...officeData,
            id: doc.id,
            logo,
            partnerships: [],
            clubs: [],
          };
          return office;
        });
        const allOfficeResolved = await Promise.all(allOffice);
        actionOffice.setAllOffice(allOfficeResolved);
        getSnapshot(allOfficeResolved);
      });
    } catch (e: any) {
      throw Error("[getAllOffice]\n" + e);
    }
  };

  // TODO : make one function to retrieve image url
  const getOfficeLogo = async (officeAcronym: string) => {
    const logoRef = ref(assetsRef, `/${officeAcronym}.png`);
    try {
      const url = await getDownloadURL(logoRef);
      return url;
    } catch (error: any) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/object-not-found":
          console.log(`[${officeAcronym}] File doesn't exist`);
          break;
        case "storage/unauthorized":
          console.log(
            `[${officeAcronym}] User doesn't have permission to access the object`
          );
          break;
        case "storage/canceled":
          console.log(`[${officeAcronym}] User canceled the upload`);
          break;
        case "storage/unknown":
          console.log(
            `[${officeAcronym}] Unknown error occurred, inspect the server response`
          );
          break;
      }
      return "https://www.bordeaux-inp.fr/sites/default/files/upload/BordeauxINP/FOOTER/COMMUNICATION/LOGOS/logo_ensc.jpg";
    }
  };

  return { getAllOffice };
};

export const usePost = () => {
  // const allOffice = useUnit($officeStore);
  const { getAllOffice } = useOffice();
  const getAllPost = async () => {
    try {
      await getAllOffice((allOffice) => {
        const q = query(postCollection, orderBy("createdAt", "desc"));
        onSnapshot(q, async (snapshot) => {
          const postList = snapshot.docs.map(async (doc) => {
            const postData = doc.data() as fb_Post;
            const editor = allOffice.find(
              (office) => office.id === postData.editor
            );
            if (!editor) {
              throw Error(`There is no editor for the post ${doc.id}.\n`);
            }
            const imageURL = await getPostImgURL(postData.image);
            const post: Post = {
              ...postData,
              id: doc.id,
              editor: { id: editor.id, logo: editor.logo },
              image: imageURL,
              createdAt: postData.createdAt.toDate(),
              date: {
                start: postData.date.start?.toDate(),
                end: postData.date.end?.toDate(),
              },
            };
            return post;
          });
          const postListResolved = await Promise.all(postList);
          actionPost.setAllPost(postListResolved);
        });
      });
    } catch (e: any) {
      throw Error("Une erreur est survenue.\n" + e);
    }
  };

  // const getEventPosts = async () => {
  //   try {
  //     const q = query(
  //       postCollection,
  //       where("visibleCal", "==", true),
  //       orderBy("createdAt", "desc")
  //     );
  //     onSnapshot(q, async (snapshot) => {
  //       const posts = snapshot.docs.map(async (doc) => {
  //         const data = doc.data() as fb_Post;
  //         const office = await getOneOffice(data.editor);
  //         const post: Post = {
  //           id: doc.id,
  //           editorLogo: office.logo,
  //           ...data,
  //         };
  //         return post;
  //       });
  //       actionPost.getPosts(await Promise.all(posts));
  //     });
  //   } catch (e: any) {
  //     throw Error("Une erreur est survenue.\n" + e);
  //   }
  // };

  const getPostImgURL = async (id: string) => {
    const imgRef = ref(imgPostRef, `/${id}`);
    try {
      const url = await getDownloadURL(imgRef);
      return url;
    } catch (error: any) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/object-not-found":
          // File doesn't exist
          break;
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;
        case "storage/unknown":
          // Unknown error occurred, inspect the server response
          break;
      }
    }
  };

  return { getAllPost };
};

// ===== CLUBS =====

// const getAllClubs = async () => {
//   const querySnapshot = await getDocs(clubCollection);
//   const clubs = querySnapshot.docs.map((doc) => {
//     const data = doc.data() as fb_Club;
//     const office = getId(data.office);
//     return { ...data, office: office };
//   });
//   return clubs;
// };
