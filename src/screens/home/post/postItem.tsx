import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  NativeSyntheticEvent,
  TextLayoutEventData,
  TouchableOpacity,
  View,
} from "react-native";
import { useUnit, useStoreMap } from "effector-react";
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
import { HomeProps } from "@navigation/navigationTypes";
import { $sessionStore } from "@context/sessionStore";
import { officeStyles } from "@styles";
import { displayDateFromTimestamp } from "utils/dateUtils";
import { DateType, Post } from "@types";
import { usePost } from "@firebase";
import { $officeStore } from "@context/officeStore";

type PostItemProps = Partial<HomeProps> & { post: Post };
const MAX_LENGTH = 50;

export const PostItem = ({ post, navigation }: PostItemProps) => {
  const { role } = useUnit($sessionStore);
  const { deletePost } = usePost();
  const [date, setDate] = useState<DateType>({ start: "null", end: "null" });
  const [allDay, setAllDay] = useState<boolean>(false);
  const [textShown, setTextShown] = useState(false);
  // const [lengthMore, setLengthMore] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const office = useStoreMap({
    store: $officeStore,
    keys: [post.id],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === post.editorId),
  });

  const lengthMore = post.description && post.description.length > MAX_LENGTH;

  useEffect(() => {
    if (post.date) {
      const result = displayDateFromTimestamp(post.date);
      setAllDay(result.allday);
      setDate(result.date);
    }
  }, [post]);

  const toggleNumberOfLines = () => {
    setTextShown((value) => !value);
  };
  return (
    <Container>
      <Body>
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
          <View style={{ flex: 1 }}>
            <Title2>{post.title}</Title2>
            <Row $padding="0 10px" style={{ flexWrap: "wrap" }}>
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
            </Container>
          </Row>
        )}
        <Text>
          {textShown || !lengthMore
            ? post.description
            : `${post.description?.slice(0, MAX_LENGTH)}...`}
        </Text>
        {lengthMore && (
          <TouchableOpacity onPress={toggleNumberOfLines}>
            <Text style={{ textDecorationLine: "underline" }}>
              {textShown ? "Voir moins" : "Voir plus"}
            </Text>
          </TouchableOpacity>
        )}
      </Body>
      {post.imageUrl && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => setShowImage(true)}
            style={{ flex: 1 }}
          >
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
      {["OFFICE_ROLE", "ADMIN_ROLE"].includes(role) && (
        <Row $justify="space-around" $padding="10px 0 0">
          <Button
            mode="contained-tonal"
            icon="pencil"
            onPress={() => navigation?.navigate("updatePost", { post })}
            style={{ borderRadius: 10 }}
          >
            Modifier
          </Button>
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
        </Row>
      )}
    </Container>
  );
};
