import { createEffect, createEvent, createStore } from "effector";
import { getAllPosts } from "firebase/firebase.utils";
import { Post } from "types";

const actionPost = {
  getPosts: createEffect("GET_POSTS", {
    handler: (setPosts: (state: Post[]) => void) => getAllPosts(setPosts),
  }),
  setPosts: createEvent<Post[]>("SET_POSTS"),
  logout: createEvent("LOGOUT"),
};

const defaultPosts: Post[] = [];

const $postStore = createStore(defaultPosts)
  .on(actionPost.getPosts, (posts) => posts)
  .on(actionPost.setPosts, (state) => state)
  .reset(actionPost.logout);

export { $postStore, actionPost };
