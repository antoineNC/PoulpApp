import { useEffect, useState } from "react";
import { FlatList, View, TouchableOpacity, Modal } from "react-native";

import { getAllPosts } from "firebase/firebase.utils";
import { Post } from "types";
import { PostDisplay } from "components/postDisplay";
import { PostItem } from "components/postItem";

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [displayedPost, setDisplayedPost] = useState<Post>();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getAllPosts((posts) => setPosts(posts));
  }, []);

  const toggleModal = () => setModalVisible((prev) => !prev);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => {
          return (
            <>
              <Modal
                visible={modalVisible}
                animationType="fade"
                onRequestClose={toggleModal}
              >
                <PostDisplay item={displayedPost} />
              </Modal>
              <TouchableOpacity
                onPress={() => {
                  setDisplayedPost(item);
                  toggleModal();
                }}
              >
                <PostItem item={item} />
              </TouchableOpacity>
            </>
          );
        }}
      />
    </View>
  );
}
