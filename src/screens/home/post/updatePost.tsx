import { useEffect, useState } from "react";
import { useStoreMap } from "effector-react";

import { getPost, updatePost } from "@fb/service/post.service";
import { $officeStore } from "@context/officeStore";
import { UpdatePostProps } from "@navigation/navigationTypes";
import { Post, PostFormFields } from "types/post.type";
import { notificationToast } from "utils/toast";
import { getErrorMessage } from "utils/errorUtils";
import { PostForm } from "./postForm";

export default function UpdatePostScreen({
  navigation,
  route,
}: UpdatePostProps) {
  const { postId } = route.params;
  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const func = async () => {
      try {
        const result = await getPost(postId);
        setPost(result);
      } catch (e) {
        const msg = getErrorMessage(e);
        notificationToast("error", msg);
        navigation.goBack();
      }
    };
    func();
  }, [navigation, postId]);

  const editor = useStoreMap({
    store: $officeStore,
    keys: [post?.id],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === post?.editorId),
  });

  const onSubmit = async (data: PostFormFields) => {
    try {
      setLoading(true);
      if (!post) {
        throw new Error("post/not-found");
      }
      await updatePost(data, post.id);
      notificationToast("success", "Post mis à jour.");
    } catch (e) {
      const msg = getErrorMessage(e);
      notificationToast("error", msg);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };
  if (!post || !editor) {
    return null;
  }

  const defaultValues = {
    title: post.title,
    description: post.description,
    editor: { value: post.editorId, label: editor.name },
    tags: post.tags,
    date: post.date,
    imageFile: post.imageUrl,
  };
  return (
    <PostForm
      defaultValues={defaultValues}
      loading={loading}
      onSubmit={onSubmit}
    />
  );
}
