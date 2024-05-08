import { createEvent, createStore } from "effector";

const actionPost = {
  getPosts: createEvent<Post[]>("GET_POSTS"),
  logout: createEvent("LOGOUT"),
};

const defaultPosts: Post[] = [];

const $postStore = createStore(defaultPosts)
  .on(actionPost.getPosts, (_, posts) => posts)
  .reset(actionPost.logout);

export { $postStore, actionPost };
