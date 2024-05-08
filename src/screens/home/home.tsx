import { useState } from "react";
import { FlatList, View, TouchableOpacity, Modal } from "react-native";
import { Divider } from "react-native-paper";
import { useUnit } from "effector-react";

import { $postStore } from "@context/postStore";
import { PostDisplay } from "components/postDisplay";
import { PostItem } from "components/postItem";
import { Container } from "@styledComponents";
import { colors } from "@theme";

export default function HomeScreen() {
  const posts = useUnit($postStore);
  const [displayedPost, setDisplayedPost] = useState<Post>();
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible((prev) => !prev);

  return (
    <Container>
      <Modal
        visible={modalVisible}
        animationType="fade"
        onRequestClose={toggleModal}
        transparent
      >
        <PostDisplay item={displayedPost} toggleModal={toggleModal} />
      </Modal>
      <FlatList
        data={posts}
        fadingEdgeLength={5}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <Divider
            style={{ backgroundColor: colors.black, marginVertical: 10 }}
          />
        )}
        ListFooterComponent={() => <View style={{ minHeight: 50 }}></View>}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setDisplayedPost(item);
                toggleModal();
              }}
            >
              <PostItem item={item} />
            </TouchableOpacity>
          );
        }}
      />
    </Container>
  );
}
