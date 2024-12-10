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
  onSnapshot,
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
import { Post, PostFieldNames } from "@types";
import { storageUrl } from "@fb-config";
import { deleteObject, ref } from "firebase/storage";

const POST_LIMIT = 10;

const app = getApp();
const db = getFirestore(app);
const postCollection = collection(db, "Post");

const postMapping = async (
  doc: QueryDocumentSnapshot<DocumentData, DocumentData>
) => {
  const postData = doc.data();
  const imageUrl =
    postData.imageId && (await getImgURL(imgPostRef, postData.imageId));
  const post: Post = {
    id: doc.id,
    title: postData.title,
    description: postData.description,
    editorId: postData.editorId,
    imageUrl,
    createdAt: postData.createdAt,
    tags: postData.tags,
    date: postData.date && {
      start: postData.date.start,
      end: postData.date.end,
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
    const post = await postMapping(postDoc);
    return post;
  } catch (e) {
    throw new Error(`[get post] ${e}`);
  }
}

function getInitialPost(
  setPosts: (postList: Post[], lastVisibleId?: string) => void
) {
  try {
    const queryConstraints: QueryConstraint[] = [
      orderBy("createdAt", "desc"),
      limit(POST_LIMIT),
    ];
    const q = query(postCollection, ...queryConstraints);
    return onSnapshot(q, async (snap) => {
      const postList: Post[] = [];
      for (const doc of snap.docs) {
        const post = await postMapping(doc);
        postList.push(post);
      }
      setPosts(postList, snap.docs[snap.docs.length - 1]?.id);
    });
  } catch (e: any) {
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
    const postList = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const post = await postMapping(doc);
        return post;
      })
    );

    return { postList, lastVisibleId: postList[postList.length - 1]?.id };
  } catch (e) {
    throw new Error(`[get more post] ${e}`);
  }
}

async function createPost(props: PostFieldNames) {
  const postFields = {
    title: props.title,
    editorId: props.editor.value,
    createdAt: Timestamp.now(),
    ...(props.date && { date: props.date }),
    description: props.description || "",
    imageId: props.imageFile || "",
    tags: props.tags || [],
  };
  try {
    if (props.imageFile) {
      const name = await uploadImage(
        props.imageFile,
        `${postFields.createdAt.seconds}_`,
        imgPostRef
      );
      postFields["imageId"] = name;
    }
    await addDoc(postCollection, postFields);
  } catch (e) {
    throw new Error("[createPost]: " + e);
  }
}

async function updatePost(props: PostFieldNames, id: string) {
  try {
    const postRef = doc(postCollection, id);
    const snapshot = await getDoc(postRef);
    if (!snapshot.exists()) {
      throw "Cet élément n'existe pas";
    }
    const postData = snapshot.data();
    const updatedFields = {
      title: props.title,
      editorId: props.editor.value,
      createdAt: postData.createdAt,
      date: props.date,
      description: props.description || "",
      imageId: props.imageFile || "",
      tags: props.tags || [],
    };
    if (props.imageFile) {
      if (!props.imageFile.startsWith(storageUrl)) {
        const today = Timestamp.now().seconds;
        const name = await uploadImage(
          props.imageFile,
          `${today}_`,
          imgPostRef
        );
        updatedFields["imageId"] = name;
        if (postData?.imageId) {
          deleteObject(ref(imgPostRef, postData?.imageId));
        }
      } else {
        delete updatedFields.imageId;
      }
    } else {
      updatedFields["imageId"] = "";
      if (postData?.imageId) {
        deleteObject(ref(imgPostRef, postData?.imageId));
      }
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
    const snapshot = await getDoc(postRef);
    if (snapshot.exists()) {
      const postData = snapshot.data();
      if (postData?.imageId) {
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
