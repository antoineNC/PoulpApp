import { useCallback, useState } from "react";
import {
  FlatList,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { AnimatedFAB, useTheme } from "react-native-paper";
import { PostItem } from "@screens/home/post/postItem";
import { Container } from "@styledComponents";
import { FeedProps } from "@navigation/navigationTypes";
import { useRight } from "utils/rights";
import Spinner from "react-native-loading-spinner-overlay";
import {
  deletePost,
  getInitialPost,
  getMorePost,
} from "@fb/service/post.service";
import { useUnit } from "effector-react";
import { $postStore, actionPost } from "@context/postStore";
import { useGetPost } from "hooks/post";
import { getPostErrMessage } from "utils/errorUtils";
import { notificationToast } from "utils/toast";

export default function FeedScreen({ navigation }: FeedProps) {
  const { posts, lastVisibleId } = useUnit($postStore);
  const { colors } = useTheme();
  const { hasRight } = useRight();
  const [isExtended, setIsExtended] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  useGetPost();

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const onEndReachedHandle = async () => {
    if (lastVisibleId) {
      const { postList, lastVisibleId: newLastVisibleId } = await getMorePost(
        lastVisibleId
      );
      actionPost.setMorePost({
        posts: postList,
        lastVisibleId: newLastVisibleId,
      });
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const { postList, lastVisibleId } = await getInitialPost();
      actionPost.setPostList({ posts: postList, lastVisibleId });
    } catch (error) {
      const msg = getPostErrMessage(error);
      notificationToast("error", msg);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const onPressOffice = (officeId: string) =>
    navigation.navigate("officeContainer", {
      screen: "viewOffice",
      params: { officeId },
    });
  const onPressCalendar = (date?: Date) =>
    navigation.navigate("calendar", { postDate: date?.valueOf() });
  const onPressUpdate = (id: string) =>
    navigation.navigate("updatePost", { postId: id });
  const onPressDelete = async (id: string) => {
    setLoading(true);
    try {
      await deletePost(id);
      const { postList, lastVisibleId } = await getInitialPost();
      actionPost.setPostList({ posts: postList, lastVisibleId });
      notificationToast("success", "Le post a été supprimé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {loading && (
        <Spinner
          visible={loading}
          textContent={"Chargement..."}
          textStyle={{ color: colors.onBackground }}
        />
      )}
      <FlatList
        onScroll={onScroll}
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PostItem
            post={item}
            onPressOffice={onPressOffice}
            onPressCalendar={() => onPressCalendar(item.date?.start)}
            onPressUpdate={() => onPressUpdate(item.id)}
            onPressDelete={() => onPressDelete(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 40 }} />}
        ListFooterComponent={<View style={{ marginVertical: 40 }} />}
        onEndReached={onEndReachedHandle}
        onEndReachedThreshold={1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {hasRight("POST", "CREATE") && (
        <AnimatedFAB
          icon={"plus"}
          label={"Créer un post"}
          extended={isExtended}
          onPress={() => navigation.navigate("createPost")}
          visible={true}
          style={styles.fabStyle}
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  fabStyle: {
    bottom: 20,
    right: 16,
    position: "absolute",
  },
});
