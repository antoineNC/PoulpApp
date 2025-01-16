import React, { useState } from "react";

import { createPost } from "@fb/service/post.service";
import { CreatePostProps } from "@navigation/navigationTypes";
import { PostFormFields } from "types/post.type";
import { notificationToast } from "utils/toast";
import { getErrorMessage } from "utils/errorUtils";
import { PostForm } from "./postForm";

export default function CreatePostScreen({ navigation }: CreatePostProps) {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: PostFormFields) => {
    try {
      setLoading(true);
      await createPost(data);
      notificationToast("success", "Post créé avec succès.");
    } catch (e) {
      const msg = getErrorMessage(e);
      notificationToast("error", msg);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return <PostForm create loading={loading} onSubmit={onSubmit} />;
}
