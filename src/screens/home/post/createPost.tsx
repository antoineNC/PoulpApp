import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreatePostProps } from "@navigation/navigationTypes";
import { PostFormFields } from "types/post.type";
import { createPost } from "@fb/service/post.service";
import React from "react";
import { PostForm } from "./postForm";

export default function CreatePostScreen({ navigation }: CreatePostProps) {
  const [loading, setLoading] = useState(false);
  const formParams = useForm<PostFormFields>();

  const onSubmit = async (data: PostFormFields) => {
    try {
      setLoading(true);
      await createPost(data);
    } catch (e) {
      throw new Error("[submit createpost]: " + e);
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
