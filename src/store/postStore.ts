import { createEvent, createStore } from "effector";
import { Post } from "types/post.type";

type PostStoreType = {
  posts: Post[];
  lastVisibleId?: string;
};

const actionPost = {
  setPostList: createEvent<PostStoreType>("SET_POST_LIST"),
  setMorePost: createEvent<PostStoreType>("SET_MORE_POST"),
  logout: createEvent("LOGOUT"),
};

const defaultPosts: PostStoreType = {
  posts: [],
};

const $postStore = createStore(defaultPosts)
  .on(actionPost.setPostList, (_, payload) => ({
    ...payload,
  }))
  .on(actionPost.setMorePost, (state, payload) => ({
    posts: [...state.posts, ...payload.posts],
    lastVisibleId: payload.lastVisibleId,
  }))
  .reset(actionPost.logout);

export { $postStore, actionPost };
