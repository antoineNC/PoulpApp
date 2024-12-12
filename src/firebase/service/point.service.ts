import { getApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { Point, PointsFormFields } from "types/point.type";

const app = getApp();
const db = getFirestore(app);
const pointCollection = collection(db, "Point");

function subscribeAllPoint(setState: (officeList: Point[]) => void) {
  try {
    const q = query(
      pointCollection,
      orderBy("date", "desc")
      // where("role", "in", ["BDE", "BDS", "BDA", "I2C"])
    );
    return onSnapshot(q, async (snapshot) => {
      const allPoint = snapshot.docs.map(async (doc) => {
        const pointData = doc.data();
        const office: Point = {
          id: doc.id,
          title: pointData.title,
          date: pointData.date,
          blue: pointData.blue,
          green: pointData.green,
          orange: pointData.orange,
          red: pointData.red,
          yellow: pointData.yellow,
        };
        return office;
      });
      const allPointResolved = await Promise.all(allPoint);
      setState(allPointResolved);
    });
  } catch (e: any) {
    throw new Error(`[get points] ${e}`);
  }
}

async function createPoint(props: PointsFormFields) {
  const pointFields = {
    title: props.title,
    date: props.date,
    blue: props.blue,
    red: props.red,
    yellow: props.yellow,
    orange: props.orange,
    green: props.green,
  };
  try {
    await addDoc(pointCollection, pointFields);
  } catch (e) {
    throw new Error("[create point]: " + e);
  }
}

async function updatePoint(props: PointsFormFields, id: string) {
  try {
    const pointRef = doc(pointCollection, id);
    const pointDoc = await getDoc(pointRef);
    if (!pointDoc.exists()) {
      throw "Cet élément n'existe pas";
    }
    const updatedFields = {
      title: props.title,
      date: props.date,
      blue: props.blue,
      red: props.red,
      yellow: props.yellow,
      orange: props.orange,
      green: props.green,
    };
    await updateDoc(pointRef, updatedFields);
  } catch (e) {
    throw new Error("[update point]: " + e);
  }
}

async function deletePoint(idPoint: string) {
  try {
    const pointRef = doc(pointCollection, idPoint);
    const pointDoc = await getDoc(pointRef);
    if (pointDoc.exists()) {
      await deleteDoc(pointRef);
    }
  } catch (e) {
    throw new Error("[delete point]: " + e);
  }
}

export { subscribeAllPoint, createPoint, updatePoint, deletePoint };
