import { getApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { MarkedDates } from "react-native-calendars/src/types";

import {
  getImgURL,
  imgPostRef,
  uploadImage,
} from "@fb/service/storage.service";
import { storageUrl } from "@fb-config";
import {
  Post,
  FirestorePost,
  PostFormFields,
  UpdatePostFields,
  CreatePostFields,
} from "types/post.type";
import { AgendaItemType, CalendarSection } from "types/calendar.type";
import {
  formatDate,
  formatHour,
  getCurrentScholarYear,
  getDuration,
} from "utils/dateUtils";

const POST_LIMIT = 10;

const app = getApp();
const db = getFirestore(app);
const postCollection = collection(db, "Post");

const postMapping = async (
  doc: QueryDocumentSnapshot<DocumentData, DocumentData>
) => {
  const postData = doc.data() as FirestorePost;
  const imageUrl =
    postData.imageId && (await getImgURL(imgPostRef, postData.imageId));
  const post: Post = {
    id: doc.id,
    title: postData.title,
    description: postData.description,
    editorId: postData.editorId,
    imageUrl,
    tags: postData.tags,
    date: {
      start: postData.date.start?.toDate(),
      end: postData.date.end?.toDate(),
    },
  };
  return post;
};

async function getPost(id: string) {
  try {
    const postDoc = await getDoc(doc(postCollection, id));
    if (!postDoc.exists()) {
      throw "Cet élément n'existe pas";
    }
    return postMapping(postDoc);
  } catch (e) {
    throw e;
  }
}

async function getInitialPost() {
  try {
    const queryConstraints: QueryConstraint[] = [
      orderBy("createdAt", "desc"),
      limit(POST_LIMIT),
    ];
    const q = query(postCollection, ...queryConstraints);
    const snapshot = await getDocs(q);
    const postList: Post[] = await Promise.all(
      snapshot.docs.map((doc) => postMapping(doc))
    );
    return { postList, lastVisibleId: postList[postList.length - 1]?.id };
  } catch (e) {
    throw e;
  }
}

async function getMorePost(lastVisibleId: string) {
  try {
    const lastDoc = await getDoc(doc(postCollection, lastVisibleId));
    const queryConstraints: QueryConstraint[] = [
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(POST_LIMIT),
    ];
    const q = query(postCollection, ...queryConstraints);
    const snapshot = await getDocs(q);
    const postList: Post[] = await Promise.all(
      snapshot.docs.map((doc) => postMapping(doc))
    );
    return { postList, lastVisibleId: postList[postList.length - 1]?.id };
  } catch (e) {
    throw e;
  }
}

async function createPost(props: PostFormFields) {
  const createFields: CreatePostFields = {
    title: props.title,
    editorId: props.editor.value,
    createdAt: Timestamp.now(),
    description: props.description || "",
    tags: props.tags || [],
    imageId: "",
    date: {},
  };
  try {
    if (props.imageFile) {
      const imageId = await uploadImage(
        props.imageFile,
        `${createFields.createdAt.seconds}_`,
        imgPostRef
      );
      createFields["imageId"] = imageId;
    }
    if (props.date?.start) {
      const start = Timestamp.fromDate(props.date.start);
      createFields["date"]["start"] = start;
      if (props.date.end) {
        const end = Timestamp.fromDate(props.date.end);
        createFields["date"]["end"] = end;
      }
    }
    await addDoc(postCollection, createFields);
  } catch (e) {
    throw e;
  }
}

async function updatePost(props: PostFormFields, id: string) {
  try {
    const postRef = doc(postCollection, id);
    const snapshot = await getDoc(postRef);
    if (!snapshot.exists()) {
      throw new Error("post/not-found", { cause: id });
    }
    const postData = snapshot.data() as FirestorePost;
    const updatedFields: UpdatePostFields = {
      title: props.title,
      editorId: props.editor.value,
      description: props.description,
      tags: props.tags,
      imageId: props.imageFile,
      date: {},
    };

    if (props.imageFile) {
      if (!props.imageFile.startsWith(storageUrl)) {
        const today = Timestamp.now().seconds;
        const imageId = await uploadImage(
          props.imageFile,
          `${today}_`,
          imgPostRef
        );
        updatedFields["imageId"] = imageId;
        if (postData.imageId) {
          deleteObject(ref(imgPostRef, postData.imageId));
        }
      } else {
        delete updatedFields.imageId;
      }
    } else {
      if (postData.imageId) {
        deleteObject(ref(imgPostRef, postData.imageId));
      }
    }

    if (props.date?.start) {
      const start = Timestamp.fromDate(props.date.start);
      updatedFields["date"]["start"] = start;
      if (props.date.end) {
        const end = Timestamp.fromDate(props.date.end);
        updatedFields["date"]["end"] = end;
      }
    }
    await updateDoc(postRef, updatedFields);
  } catch (e) {
    throw e;
  }
}

async function deletePost(idPost: string) {
  try {
    const postRef = doc(postCollection, idPost);
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) {
      throw new Error("post/not-found");
    }
    const postData = postDoc.data();
    if (postData.imageId) {
      deleteObject(ref(imgPostRef, postData?.imageId));
    }
    await deleteDoc(postRef);
  } catch (e) {
    throw e;
  }
}

async function getCalendarItems() {
  try {
    const { startDate, endDate } = getCurrentScholarYear();
    const q = query(
      postCollection,
      where("date.start", ">=", startDate),
      where("date.start", "<=", endDate),
      orderBy("date.start", "asc")
    );
    const snapshot = await getDocs(q);
    const agendaItemsGroupped: { [date: string]: AgendaItemType[] } =
      snapshot.docs.reduce<{
        [date: string]: AgendaItemType[];
      }>((groupedItems, postDoc) => {
        const postData = postDoc.data() as FirestorePost;
        if (postData.date?.start) {
          const endDate = postData?.date?.end?.toDate();
          const startDate = postData.date.start.toDate();
          const date = formatDate(startDate);
          const hour = endDate ? formatHour(startDate) : "Journée entière";
          const duration = getDuration(startDate, endDate);
          if (!groupedItems[date]) {
            groupedItems[date] = [];
          }
          groupedItems[date].push({
            title: postData.title,
            description: postData.description,
            startHour: hour,
            duration,
          });
        }
        return groupedItems;
      }, {});

    const sections: CalendarSection[] = [];
    const markedDates: MarkedDates = {};
    Object.keys(agendaItemsGroupped).forEach((key) => {
      if (agendaItemsGroupped[key]) {
        sections.push({ title: key, data: agendaItemsGroupped[key] });
        markedDates[key] = { marked: true };
      }
    });

    return { sections, markedDates };
  } catch (e) {
    throw e;
  }
}

export {
  getPost,
  getInitialPost,
  getMorePost,
  createPost,
  updatePost,
  deletePost,
  getCalendarItems,
};
