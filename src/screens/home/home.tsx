import { useEffect, useState } from "react";
import { FlatList, View, Text } from "react-native";

import { getAllPosts } from "firebase/firebase.utils";

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getAllPosts((posts) => setPosts(posts));
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
