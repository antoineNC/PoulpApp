import { actionPost } from "@context/postStore";
import { subscribeInitialPost } from "@fb/service/post.service";
import { useEffect } from "react";

export function useSubPost(refresh: boolean) {
  useEffect(() => {
    const unsub = subscribeInitialPost((posts, lastVisibleId) =>
      actionPost.setPostList({ posts, lastVisibleId })
    );
    return () => unsub();
  }, [refresh]);
}
