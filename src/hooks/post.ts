import { useEffect } from "react";

import { getInitialPost } from "@fb/service/post.service";
import { actionPost } from "@context/postStore";
import { handleError } from "utils/errorUtils";

export function useGetPost() {
  useEffect(() => {
    const getPosts = async () => {
      try {
        const { postList, lastVisibleId } = await getInitialPost();
        actionPost.setPostList({ posts: postList, lastVisibleId });
      } catch (e) {
        handleError(e);
      }
    };
    getPosts();
  }, []);
}
