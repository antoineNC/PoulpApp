import { useEffect, useState } from "react";
import { usePost } from "@firebase";
import Spinner from "react-native-loading-spinner-overlay";
import { UpdatePostProps } from "@navigation/navigationTypes";
import { Post, PostFieldNames } from "@types";
import { UpdatePostForm } from "./updatePostForm";
import { colors } from "@theme";

export default function UpdatePostScreen({
  navigation,
  route,
}: UpdatePostProps) {
  const { postId } = route.params;
  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(false);
  const { updatePost, getPost } = usePost();
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
        textStyle={{ color: colors.white }}
      />
    );
  }

  const onSubmit = async (data: PostFieldNames) => {
    try {
      setLoading(true);
      await updatePost({ ...data }, post.id);
    } catch (e) {
      console.error("[updatepost]", e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return <UpdatePostForm post={post} loading={loading} onSubmit={onSubmit} />;
}
