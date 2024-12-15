import { useEffect, useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { UpdatePostProps } from "@navigation/navigationTypes";
import { UpdatePostForm } from "./updatePostForm";
import { colors } from "@theme";
import { Post, PostFormFields } from "types/post.type";
import { getPost, updatePost } from "@fb/service/post.service";

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

  if (!post) {
    return (
      <Spinner
        visible={true}
        textContent={"Chargement..."}
        // textStyle={{ color: colors.white }}
      />
    );
  }

  const onSubmit = async (data: PostFormFields) => {
    try {
      setLoading(true);
      await updatePost(data, post.id);
    } catch (e) {
      throw new Error("[submit updatepost]: " + e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return <UpdatePostForm post={post} loading={loading} onSubmit={onSubmit} />;
}
