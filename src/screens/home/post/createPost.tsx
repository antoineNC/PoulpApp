import React, { useEffect, useState } from "react";

import { createPost } from "@fb/service/post.service";
import { CreatePostProps } from "@navigation/navigationTypes";
import { PostFormFields } from "types/post.type";
import { notificationToast } from "utils/toast";
import { handleError } from "utils/errorUtils";
import { PostForm } from "./postForm";
import { useRight } from "utils/rights";

export default function CreatePostScreen({ navigation }: CreatePostProps) {
  const { hasRight } = useRight();
  useEffect(() => {
    if (!hasRight("POST", "CREATE")) navigation.navigate("feed");
  }, [hasRight, navigation]);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: PostFormFields) => {
    try {
      setLoading(true);
      await createPost(data);
      notificationToast("success", "Post créé avec succès.");
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return <PostForm create loading={loading} onSubmit={onSubmit} />;
}
