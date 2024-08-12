import { useEffect, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { useUnit } from "effector-react";
import { Button } from "react-native-paper";
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
import { displayDate } from "utils/dateUtils";

type PostItemProps = Partial<HomeProps> & { post: Post };

export const PostItem = ({ post, navigation }: PostItemProps) => {
  const { role } = useUnit($sessionStore);
  const [date, setDate] = useState<DateType>({ start: "null", end: "null" });
  const [allDay, setAllDay] = useState<boolean>(false);
  useEffect(() => {
    if (post.date) {
      const result = displayDate(post.date);
      if (result) {
        setAllDay(result.allday);
        setDate(result.date);
      }
    }
  }, []);
  return (
    <View key={post.id}>
      <Row $padding="0 15px">
        <TouchableOpacity
          onPress={() =>
            navigation &&
            post.editor &&
            navigation?.navigate("officeContainer", {
              screen: "viewOffice",
              params: { office: post.editor },
            })
          }
        >
          <Image source={{ uri: post.editor?.logoUrl }} $size={50} />
        </TouchableOpacity>
        <View>
          <Title2>{post.title}</Title2>
          <Row $padding="0 10px">
            {post.tags?.length &&
              post.tags.length > 0 &&
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

        <Text numberOfLines={3}>{post.description}</Text>
      </Body>
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          resizeMode="contain"
          resizeMethod="scale"
        />
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
    </View>
  );
};
