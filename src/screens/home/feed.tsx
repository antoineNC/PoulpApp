import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useUnit } from "effector-react";
import { AnimatedFAB, Divider, Icon, useTheme } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

import {
  deletePost,
  getInitialPost,
  getMorePost,
} from "@fb/service/post.service";
import { FeedProps } from "@navigation/navigationTypes";
import { PostItem } from "@screens/home/post/postItem";
import { Container, Row } from "@styledComponents";
import { $postStore, actionPost } from "@context/postStore";
import { useGetPost } from "hooks/post";
import { useRight } from "utils/rights";
import { handleError } from "utils/errorUtils";
import { notificationToast } from "utils/toast";
import { TitleText } from "components/customText";
import { pencil, trash } from "components/icon/icons";

export default function FeedScreen({ navigation }: FeedProps) {
  const { posts, lastVisibleId } = useUnit($postStore);
  const { colors } = useTheme();
  const { hasRight } = useRight();
  const [postId, setPostId] = useState<string | null>(null);
  const [isExtended, setIsExtended] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useGetPost();

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const onEndReachedHandle = async () => {
    if (lastVisibleId) {
      const { postList, lastVisibleId: newLastVisibleId } = await getMorePost(
        lastVisibleId
      );
      actionPost.setMorePost({
        posts: postList,
        lastVisibleId: newLastVisibleId,
      });
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const { postList, lastVisibleId } = await getInitialPost();
      actionPost.setPostList({ posts: postList, lastVisibleId });
    } catch (error) {
      handleError(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const onPressOffice = (officeId: string) =>
    navigation.navigate("officeContainer", {
      screen: "viewOffice",
      params: { officeId },
    });

  const onPressCalendar = (date?: Date) =>
    navigation.navigate("calendar", { postDate: date?.valueOf() });

  const onPressUpdate = () => {
    if (!postId) return;
    navigation.navigate("updatePost", { postId });
    bottomSheetRef.current?.close();
  };

  const onPressDelete = () =>
    Alert.alert("Suppression", "Veux-tu vraiment supprimer ce post ?", [
      {
        text: "Oui, supprimer",
        onPress: onConfirmDelete,
      },
      { text: "Annuler" },
    ]);

  const onConfirmDelete = async () => {
    if (!postId) return;
    bottomSheetRef.current?.close();
    setLoading(true);
    try {
      await deletePost(postId);
      const { postList, lastVisibleId } = await getInitialPost();
      actionPost.setPostList({ posts: postList, lastVisibleId });
      notificationToast("success", "Le post a été supprimé.");
    } finally {
      setLoading(false);
    }
  };

  const renderBackdrop = useCallback(
    (
      props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps
    ) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <Container>
      {loading && (
        <Spinner
          visible={loading}
          textContent={"Chargement..."}
          textStyle={{ color: colors.onBackground }}
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
            toggleBottomsheet={() => {
              setPostId(item.id);
              bottomSheetRef.current?.expand();
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 40 }} />}
        ListFooterComponent={<View style={{ marginVertical: 40 }} />}
        onEndReached={onEndReachedHandle}
        onEndReachedThreshold={1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        containerStyle={{ zIndex: 1 }}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.primary }}
      >
        <BottomSheetView>
          <TouchableOpacity onPress={onPressUpdate}>
            <Row
              style={{
                margin: 20,
                columnGap: 10,
              }}
            >
              <Icon size={20} source={pencil} />
              <TitleText>Modifier</TitleText>
            </Row>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity onPress={onPressDelete}>
            <Row
              style={{
                margin: 20,
                columnGap: 10,
              }}
            >
              <Icon size={20} source={trash} />
              <TitleText>Supprimer</TitleText>
            </Row>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
      {hasRight("POST", "CREATE") && (
        <AnimatedFAB
          icon={"plus"}
          label={"Créer un post"}
          extended={isExtended}
          onPress={() => navigation.navigate("createPost")}
          visible={true}
          style={styles.fabStyle}
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
