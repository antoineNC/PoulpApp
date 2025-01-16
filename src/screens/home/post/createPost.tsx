import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { createPost } from "@fb/service/post.service";
import { CreatePostProps } from "@navigation/navigationTypes";
import { PostFormFields } from "types/post.type";
import { notificationToast } from "utils/toast";
import { getPostErrMessage } from "utils/errorUtils";
import { PostForm } from "./postForm";

export default function CreatePostScreen({ navigation }: CreatePostProps) {
  const [loading, setLoading] = useState(false);
  const formParams = useForm<PostFormFields>();

  const onSubmit = async (data: PostFormFields) => {
    try {
      setLoading(true);
      await createPost(data);
      notificationToast("success", "Post créé avec succès.");
    } catch (e) {
      const msg = getPostErrMessage(e);
      notificationToast("error", msg);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <PostForm
      create
      formParams={formParams}
      loading={loading}
      onSubmit={onSubmit}
    />
  );
}
