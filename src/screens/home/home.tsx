import { useEffect, useState } from "react";
import { FlatList, View, Text, Image } from "react-native";

import { getAllPosts } from "firebase/firebase.utils";
import { Post } from "types";

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getAllPosts((posts) => setPosts(posts));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => {
          return (
            <View key={item.id}>
              <Image
                source={{ uri: item.editorLogo }}
                width={50}
                style={{ aspectRatio: 1 }}
              />
              <Text>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}
