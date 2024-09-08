import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
} from "react-native";
import { AnimatedFAB } from "react-native-paper";
import { useUnit } from "effector-react";

import { $sessionStore } from "@context/sessionStore";
import { $postStore } from "@context/postStore";
import { $officeStore } from "@context/officeStore";
import { PostItem } from "components/postItem";
import { Container } from "@styledComponents";
import { usePost } from "@firebase";
import { HomeProps } from "@navigation/navigationTypes";
import { Office, Post } from "@types";

export default function HomeScreen({ navigation }: HomeProps) {
  const { role } = useUnit($sessionStore);
  const { posts, lastVisible } = useUnit($postStore);
  const { officeList } = useUnit($officeStore);
  const { getMorePost } = usePost();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubPost = async () => await getMorePost();
    unsubPost();
  }, []);

  // Create a memoized map of associationId to association
  const officeMapping = useMemo(() => {
    const map = new Map<string, Office>();
    officeList.forEach((office) => {
      map.set(office.id, office);
    });
    return map;
  }, [officeList]);

  // Merge posts with their corresponding association
  const postsWithOffice: Post[] = useMemo(() => {
    const postOffice = posts.map((post) => ({
      ...post,
      editor: officeMapping.get(post.editorId),
    }));
    return postOffice;
  }, [posts, officeMapping]);

  const handleEndReached = useCallback(async () => {
    if (lastVisible) {
      setLoading(true);
      await getMorePost(lastVisible);
      setLoading(false);
    }
  }, [loading, lastVisible]);

  const [isExtended, setIsExtended] = useState(true);

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = { ["right"]: 16 };

  return (
    <Container>
      <FlatList
        onScroll={onScroll}
        data={postsWithOffice}
        keyExtractor={(item) => item.id}
        // fadingEdgeLength={5}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PostItem post={item} navigation={navigation} />
        )}
        ItemSeparatorComponent={() => <View style={{ marginVertical: 10 }} />}
        // onEndReached={handleEndReached}
        // onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View style={{ minHeight: 40 }}>
            {/* {loading ? <ActivityIndicator animating={true} /> : null} */}
          </View>
        }
      />
      {["OFFICE_ROLE", "ADMIN_ROLE"].includes(role) && (
        <AnimatedFAB
          icon={"plus"}
          label={"Créer un post"}
          extended={isExtended}
          onPress={() => navigation.navigate("createPost")}
          visible={true}
          animateFrom={"right"}
          iconMode={"static"}
          style={[styles.fabStyle]}
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
