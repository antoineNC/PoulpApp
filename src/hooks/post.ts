import { actionPost } from "@context/postStore";
import { getInitialPost } from "@fb/service/post.service";
import { useEffect } from "react";

export function useGetPost() {
  useEffect(() => {
    const getPosts = async () => {
      const { postList, lastVisibleId } = await getInitialPost();
      actionPost.setPostList({ posts: postList, lastVisibleId });
    };
    getPosts();
  }, []);
}
