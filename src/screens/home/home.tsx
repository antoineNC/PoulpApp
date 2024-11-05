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
import { PostItem } from "components/postItem";
import { Container } from "@styledComponents";
import { usePost } from "@firebase";
import { HomeProps } from "@navigation/navigationTypes";

export default function HomeScreen({ navigation }: HomeProps) {
  const { role } = useUnit($sessionStore);
  const { posts, lastVisible } = useUnit($postStore);
  const { getMorePost } = usePost();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubPost = async () => await getMorePost();
    unsubPost();
  }, []);

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
        data={posts}
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
