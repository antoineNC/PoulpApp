import { useEffect, useState } from "react";
import { UpdatePostProps } from "@navigation/navigationTypes";
import { PostForm } from "./postForm";
import { Post, PostFormFields } from "types/post.type";
import { getPost, updatePost } from "@fb/service/post.service";
import { useForm } from "react-hook-form";
import { useStoreMap } from "effector-react";
import { $officeStore } from "@context/officeStore";

export default function UpdatePostScreen({
  navigation,
  route,
}: UpdatePostProps) {
  const { postId } = route.params;
  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const func = async () => {
      const result = await getPost(postId);
      setPost(result);
    };
    func();
  }, [postId]);

  const editor = useStoreMap({
    store: $officeStore,
    keys: [post?.id],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === post?.editorId),
  });
  const formParams = useForm<PostFormFields>({
    defaultValues: {
      title: post?.title,
      description: post?.description,
      editor: { value: post?.editorId, label: editor?.name },
      tags: post?.tags,
      date: post?.date,
      imageFile: post?.imageUrl,
    },
  });

  const onSubmit = async (data: PostFormFields) => {
    try {
      setLoading(true);
      if (!post) {
        throw "Le post n'a pas bien été chargé";
      }
      await updatePost(data, post?.id);
    } catch (e) {
      throw new Error("[submit updatepost]: " + e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <PostForm formParams={formParams} loading={loading} onSubmit={onSubmit} />
  );
}
