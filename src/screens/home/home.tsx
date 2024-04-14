import { useEffect, useState } from "react";
import { FlatList, View, Text } from "react-native";
import { useUnit } from "effector-react";

import { $postStore, actionPost } from "store/postStore";

export default function HomeScreen() {
  const storedPosts = useUnit($postStore);
  const [posts, setPosts] = useState<Post[]>(storedPosts);

  useEffect(() => {
    actionPost.getPosts((posts) => setPosts(posts));
    actionPost.setPosts(posts);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View key={item.id}>
            <Text>{item.editor}</Text>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}
