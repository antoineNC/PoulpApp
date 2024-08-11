import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, View, TouchableOpacity } from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";
import { useUnit } from "effector-react";

import { $postStore, actionPost } from "@context/postStore";
import { $officeStore } from "@context/officeStore";
import { PostItem } from "components/postItem";
import { Container } from "@styledComponents";
import { colors } from "@theme";
import { usePost } from "@firebase";
import { HomeProps } from "@navigation/navigation.types";

export default function HomeScreen({ navigation }: HomeProps) {
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

  return (
    <Container>
      <FlatList
        data={postsWithOffice}
        keyExtractor={(item) => item.id}
        fadingEdgeLength={5}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                navigation.navigate("viewPost", { post: item });
              }}
            >
              <PostItem post={item} />
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => (
          <Divider
            style={{ backgroundColor: colors.black, marginVertical: 10 }}
          />
        )}
        // onEndReached={handleEndReached}
        // onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View style={{ minHeight: 40 }}>
            {loading ? <ActivityIndicator animating={true} /> : null}
          </View>
        }
      />
    </Container>
  );
}
