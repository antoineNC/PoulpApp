import { actionPost } from "@context/postStore";
import { getInitialPost } from "@fb/service/post.service";
import { useEffect } from "react";

export function useSubPost() {
  useEffect(() => {
    getInitialPost((posts, lastVisibleId) =>
      actionPost.setPostList({ posts, lastVisibleId })
    );
    return () => {
      getInitialPost((posts, lastVisibleId) =>
        actionPost.setPostList({ posts, lastVisibleId })
      );
    };
  }, []);
}
