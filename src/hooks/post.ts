import { useEffect } from "react";

import { getInitialPost } from "@fb/service/post.service";
import { actionPost } from "@context/postStore";
import { getErrorMessage } from "utils/errorUtils";
import { notificationToast } from "utils/toast";

export function useGetPost() {
  useEffect(() => {
    const getPosts = async () => {
      try {
        const { postList, lastVisibleId } = await getInitialPost();
        actionPost.setPostList({ posts: postList, lastVisibleId });
      } catch (e) {
        const msg = getErrorMessage(e);
        notificationToast("error", msg);
      }
    };
    getPosts();
  }, []);
}
