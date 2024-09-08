import { createEffect, createEvent, createStore } from "effector";
import { usePost } from "@firebase";
import { DocumentSnapshot } from "firebase/firestore";
import { Post } from "@types";

type PostStoreType = {
  posts: Post[];
  lastVisible?: DocumentSnapshot;
  loading: boolean;
};

// const { getAllPost, getMorePost } = usePost();

const actionPost = {
  setInitialPost: createEvent<PostStoreType>("GET_POSTS"),
  setMorePost: createEvent<PostStoreType>("GET_MORE_POSTS"),
  // loadPosts: createEffect("LOAD_POSTS", {
  //   handler: async () => {
  //     const { postList, lastVisible } = await getAllPost();
  //     return { postList, lastVisible };
  //   },
  // }),
  // loadMorePosts: createEffect("LOAD_MORE_POSTS", {
  //   handler: async (lastVisible: DocumentSnapshot) => {
  //     const { postList, newLastVisible } = await getMorePost(lastVisible);
  //     return { postList, lastVisible: newLastVisible };
  //   },
  // }),
  resetPosts: createEvent("RESET_POSTS"),
  logout: createEvent("LOGOUT"),
};

const defaultPosts: PostStoreType = {
  posts: [],
  lastVisible: undefined,
  loading: false,
};

const $postStore = createStore(defaultPosts)
  // .on(actionPost.loadPosts, (state) => ({ ...state, loading: true }))
  // .on(actionPost.loadPosts.doneData, (_, { postList, lastVisible }) => ({
  //   posts: postList,
  //   lastVisible,
  //   loading: false,
  // }))
  // .on(actionPost.loadMorePosts, (state) => ({ ...state, loading: true }))
  // .on(
  //   actionPost.loadMorePosts.doneData,
  //   (state, { postList, lastVisible }) => ({
  //     posts: [...state.posts, ...postList],
  //     lastVisible,
  //     loading: false,
  //   })
  // )
  .on(actionPost.setInitialPost, (_, payload) => ({
    ...payload,
    loading: false,
  }))
  .on(actionPost.setMorePost, (state, payload) => ({
    ...payload,
    loading: false,
  }))
  .on(actionPost.resetPosts, (_) => ({
    posts: [],
    loading: false,
  }))
  .reset(actionPost.logout);

export { $postStore, actionPost };
