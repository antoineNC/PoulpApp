import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  NativeSyntheticEvent,
  TextLayoutEventData,
  TouchableOpacity,
  View,
} from "react-native";
import { useStoreMap } from "effector-react";
import { Button } from "react-native-paper";
import ImageView from "react-native-image-viewing";
import {
  Text,
  Image,
  Body,
  Title2,
  Row,
  BodyTitle,
  Container,
} from "@styledComponents";
import { FeedProps } from "@navigation/navigationTypes";
import { officeStyles } from "@styles";
import { displayDateFromTimestamp } from "utils/dateUtils";
import { useRight } from "utils/rights";
import { DateType, Post } from "@types";
import { usePost } from "@firebase";
import { $officeStore } from "@context/officeStore";

type PostItemProps = Partial<FeedProps> & { post: Post };

export const PostItem = ({ post, navigation }: PostItemProps) => {
  const { deletePost } = usePost();
  const { hasRight } = useRight();
  const [date, setDate] = useState<DateType>({ start: "null", end: "null" });
  const [allDay, setAllDay] = useState<boolean>(false);
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const office = useStoreMap({
    store: $officeStore,
    keys: [post.id],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === post.editorId),
  });

  useEffect(() => {
    if (post.date) {
      const result = displayDateFromTimestamp(post.date);
      setAllDay(result.allday);
      setDate(result.date);
    }
  }, [post]);

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      setLengthMore(e.nativeEvent.lines.length >= 4);
    },
    []
  );
  const toggleNumberOfLines = () => {
    setTextShown((value) => !value);
  };
  return (
    <View style={{ rowGap: 15 }}>
      <View
        style={{
          paddingHorizontal: 15,
          rowGap: 15,
        }}
      >
        <Row>
          <TouchableOpacity
            onPress={() =>
              navigation &&
              office &&
              navigation.navigate("officeContainer", {
                screen: "viewOffice",
                params: { officeId: office.id },
              })
            }
          >
            <Image source={{ uri: office?.logoUrl }} $size={50} />
          </TouchableOpacity>
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <Title2>{post.title}</Title2>
            <Row style={{ flexWrap: "wrap" }}>
              {post.tags &&
                post.tags.map((value, index) => (
                  <Text key={index}>[{value}] </Text>
                ))}
            </Row>
          </View>
        </Row>
        {post.date && (
          <Row>
            <BodyTitle>Date : </BodyTitle>
            <Container style={officeStyles.borderRounded}>
              <TouchableOpacity
                onPress={() =>
                  navigation?.navigate("calendar", {
                    postDate: post.date?.start,
                  })
                }
              >
                {allDay ? (
                  <Text>{date.start} (toute la journée)</Text>
                ) : (
                  <>
                    <Row>
                      <BodyTitle>Début : </BodyTitle>
                      <Text>{date.start}</Text>
                    </Row>
                    <Row>
                      <BodyTitle>Fin : </BodyTitle>
                      <Text>{date.end}</Text>
                    </Row>
                  </>
                )}
              </TouchableOpacity>
            </Container>
          </Row>
        )}
        {post.description && (
          <TouchableOpacity
            onPress={toggleNumberOfLines}
            disabled={!lengthMore}
          >
            <Text
              onTextLayout={onTextLayout}
              numberOfLines={textShown ? undefined : 4}
            >
              {post.description}
            </Text>
            {lengthMore && (
              <Text style={{ textDecorationLine: "underline", marginTop: 5 }}>
                {textShown ? "Voir moins" : "Voir plus"}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
      {post.imageUrl && (
        <View>
          <TouchableOpacity onPress={() => setShowImage(true)}>
            <Image source={{ uri: post.imageUrl }} />
          </TouchableOpacity>
          <ImageView
            images={[{ uri: post.imageUrl }]}
            imageIndex={0}
            visible={showImage}
            onRequestClose={() => setShowImage(false)}
          />
        </View>
      )}
      <Row $justify="space-around">
        {hasRight("POST", "UPDATE", office?.id) && (
          <Button
            mode="contained-tonal"
            icon="pencil"
            onPress={() => navigation?.navigate("updatePost", { post })}
            style={{ borderRadius: 10 }}
          >
            Modifier
          </Button>
        )}
        {hasRight("POST", "DELETE", office?.id) && (
          <Button
            mode="contained-tonal"
            icon="delete"
            onPress={() =>
              Alert.alert(
                "Suppression",
                "Veux-tu vraiment supprimer ce post ?",
                [
                  {
                    text: "Oui, supprimer",
                    onPress: () => deletePost(post.id),
                  },
                  { text: "Annuler" },
                ]
              )
            }
            style={{ borderRadius: 10 }}
          >
            Supprimer
          </Button>
        )}
      </Row>
    </View>
  );
};
