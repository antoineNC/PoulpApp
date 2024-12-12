import { actionPost } from "@context/postStore";
import { getInitialPost } from "@fb/service/post.service";
import { useEffect } from "react";

export function useSubPost(refresh: boolean) {
  useEffect(() => {
    getInitialPost((posts, lastVisibleId) =>
      actionPost.setPostList({ posts, lastVisibleId })
    );
    return () => {
      getInitialPost((posts, lastVisibleId) =>
        actionPost.setPostList({ posts, lastVisibleId })
      );
    };
  }, [refresh]);
}
