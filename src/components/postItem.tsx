import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  NativeSyntheticEvent,
  TextLayoutEventData,
  TouchableOpacity,
  View,
} from "react-native";
import { useUnit } from "effector-react";
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

type PostItemProps = Partial<HomeProps> & { post: Post };

export const PostItem = ({ post, navigation }: PostItemProps) => {
  const { role } = useUnit($sessionStore);
  const [date, setDate] = useState<DateType>({ start: "null", end: "null" });
  const [allDay, setAllDay] = useState<boolean>(false);
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false);
  const [showImage, setShowImage] = useState(false);
  useEffect(() => {
    if (post.date) {
      const result = displayDateFromTimestamp(post.date);
      setAllDay(result.allday);
      setDate(result.date);
    }
  }, [post]);

  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };
  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      setLengthMore(e.nativeEvent.lines.length >= 3);
    },
    []
  );
  return (
    <Container key={post.id}>
      <Row $padding="0 15px">
        <TouchableOpacity
          onPress={() =>
            navigation &&
            post.editor &&
            navigation.navigate("officeContainer", {
              screen: "viewOffice",
              params: { office: post.editor },
            })
          }
        >
          <Image source={{ uri: post.editor?.logoUrl }} $size={50} />
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
      <Body>
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

        <Text
          numberOfLines={textShown ? undefined : 3}
          onTextLayout={onTextLayout}
        >
          {post.description}
        </Text>
        {lengthMore && (
          <Text
            onPress={toggleNumberOfLines}
            style={{ textDecorationLine: "underline" }}
          >
            {textShown ? "Voir moins" : "Voir plus"}
          </Text>
        )}
      </Body>
      {post.imageUrl && (
        <>
          <TouchableOpacity onPress={() => setShowImage(true)}>
            <Image
              source={{ uri: post.imageUrl }}
              resizeMode="contain"
              resizeMethod="scale"
            />
          </TouchableOpacity>
          <ImageView
            images={[{ uri: post.imageUrl }]}
            imageIndex={0}
            visible={showImage}
            onRequestClose={() => setShowImage(false)}
          />
        </>
      )}
      {["OFFICE_ROLE", "ADMIN_ROLE"].includes(role) && (
        <Row $justify="space-around" $padding="10px 0 0">
          <Button
            mode="contained-tonal"
            icon="pencil"
            onPress={() => navigation?.navigate("updatePost", { post })}
          >
            Modifier
          </Button>
          <Button
            mode="contained-tonal"
            icon="delete"
            onPress={() =>
              Alert.alert("Suppression", "Veux-tu vraiment supprimer ce post ?")
            }
          >
            Supprimer
          </Button>
        </Row>
      )}
    </Container>
  );
};
