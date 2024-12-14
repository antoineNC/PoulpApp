import { getApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
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
} from "firebase/firestore";
import {
  getImgURL,
  imgPostRef,
  uploadImage,
} from "@fb/service/storage.service";
import { storageUrl } from "@fb-config";
import { deleteObject, ref } from "firebase/storage";
import {
  Post,
  FirestorePost,
  PostFormFields,
  UpdatePostFields,
  CreatePostFields,
} from "types/post.type";

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
    date: postData.date && {
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
    throw new Error(`[get post] ${e}`);
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
    throw new Error(`[get initial post] ${e}`);
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
    throw new Error(`[get more post] ${e}`);
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
    if (props.date) {
      const start = Timestamp.fromDate(props.date.start);
      const end = Timestamp.fromDate(props.date.end);
      createFields["date"] = { start, end };
    }
    await addDoc(postCollection, createFields);
  } catch (e) {
    throw new Error("[create post]: " + e);
  }
}

async function updatePost(props: PostFormFields, id: string) {
  try {
    const postRef = doc(postCollection, id);
    const snapshot = await getDoc(postRef);
    if (!snapshot.exists()) {
      throw "Cet élément n'existe pas";
    }
    const postData = snapshot.data() as FirestorePost;
    const updatedFields: UpdatePostFields = {
      title: props.title,
      editorId: props.editor.value,
      description: props.description,
      tags: props.tags,
      imageId: props.imageFile,
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

    if (props.date) {
      const start = Timestamp.fromDate(props.date.start);
      const end = Timestamp.fromDate(props.date.end);
      updatedFields["date"] = { start, end };
    }
    await updateDoc(postRef, {
      ...updatedFields,
      ...(!updatedFields.date && { date: deleteField() }),
    });
  } catch (e) {
    throw new Error("[updatepost]: " + e);
  }
}

async function deletePost(idPost: string) {
  try {
    const postRef = doc(postCollection, idPost);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const postData = postDoc.data();
      if (postData.imageId) {
        deleteObject(ref(imgPostRef, postData?.imageId));
      }
      await deleteDoc(postRef);
    }
  } catch (e) {
    throw new Error("[delete post]: " + e);
  }
}

export {
  getPost,
  getInitialPost,
  getMorePost,
  createPost,
  updatePost,
  deletePost,
};
