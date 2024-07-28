import { useState } from "react";
import { FlatList, View, TouchableOpacity, Modal } from "react-native";
import { Divider } from "react-native-paper";
import { useUnit } from "effector-react";

import { $postStore } from "@context/postStore";
import { $officeStore } from "@context/officeStore";
import { PostDisplay } from "components/postDisplay";
import { PostItem } from "components/postItem";
import { Container } from "@styledComponents";
import { colors } from "@theme";

export default function HomeScreen() {
  const posts = useUnit($postStore);
  const { officeList } = useUnit($officeStore);
  const [displayedItem, setDisplayedItem] = useState<{
    post: Post;
    office?: Office;
  }>();
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
        <PostDisplay item={displayedItem} toggleModal={toggleModal} />
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
          const office = officeList.find((el) => el.id === item.editor);
          return (
            <TouchableOpacity
              onPress={() => {
                setDisplayedItem({ post: item, office });
                toggleModal();
              }}
            >
              <PostItem post={item} office={office} />
            </TouchableOpacity>
          );
        }}
      />
    </Container>
  );
}
