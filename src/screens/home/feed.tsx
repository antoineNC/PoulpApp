import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { AnimatedFAB, Divider } from "react-native-paper";
import { PostItem } from "@screens/home/post/postItem";
import { Container } from "@styledComponents";
import { usePost } from "@firebase";
import { FeedProps } from "@navigation/navigationTypes";
import { useRight } from "utils/rights";
import { Post } from "@types";
import { Timestamp } from "firebase/firestore";
import Spinner from "react-native-loading-spinner-overlay";
import { colors } from "@theme";

export default function FeedScreen({ navigation }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastPostId, setLastPostId] = useState<string>();
  const { getInitialPost, getMorePost, deletePost } = usePost();
  const { hasRight } = useRight();
  const [isExtended, setIsExtended] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchInitialPosts = useCallback(() => {
    return getInitialPost((firstPosts, lastId) => {
      setPosts(firstPosts);
      setLastPostId(lastId);
    });
  }, []);

  useEffect(() => {
    fetchInitialPosts();
    return () => {
      fetchInitialPosts();
    };
  }, []);

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const onEndReachedHandle = async () => {
    lastPostId &&
      (await getMorePost((morePosts, lastId) => {
        setPosts((prev) => [...prev, ...morePosts]);
        setLastPostId(lastId);
      }, lastPostId));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      fetchInitialPosts();
    } finally {
      setRefreshing(false);
    }
  }, [fetchInitialPosts]);

  const onPressOffice = (officeId: string) =>
    navigation.navigate("officeContainer", {
      screen: "viewOffice",
      params: { officeId },
    });
  const onPressCalendar = (date?: Timestamp) =>
    navigation.navigate("calendar", { postDate: date });
  const onPressUpdate = (id: string) =>
    navigation.navigate("updatePost", { postId: id });
  const onPressDelete = async (id: string) => {
    setLoading(true);
    try {
      await deletePost(id);
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
          textStyle={{ color: colors.white }}
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
        ItemSeparatorComponent={() => (
          <Divider style={{ marginVertical: 20 }} />
        )}
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
          variant="secondary"
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
