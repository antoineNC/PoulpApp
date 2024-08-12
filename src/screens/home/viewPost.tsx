import { TouchableOpacity, View } from "react-native";
import {
  Text,
  Image,
  Body,
  Row,
  Title2,
  ContainerScroll,
  BodyTitle,
  Container,
} from "@styledComponents";
import { ViewPostProps } from "@navigation/navigationTypes";
import { officeStyles } from "@styles";
import { formatAllDate, formatDay } from "utils/dateUtils";
import { useEffect, useState } from "react";
type DateType = {
  start: string;
  end: string;
};

export default function ViewPostScreen({ navigation, route }: ViewPostProps) {
  const { post } = route.params;
  const [date, setDate] = useState<DateType>({ start: "null", end: "null" });
  const [allDay, setAllDay] = useState<boolean>(false);
  useEffect(() => {
    if (post.date) {
      const startDate = new Date(post.date.start).toUTCString();
      const endDate = new Date(post.date.end).toUTCString();
      if (startDate === endDate) {
        setAllDay(true);
        const day = formatDay(startDate);
        setDate({ start: day, end: day });
      } else {
        setAllDay(false);
        const start = formatAllDate(startDate);
        const end = formatAllDate(endDate);
        setDate({ start, end });
      }
    }
  }, []);
  return (
    <ContainerScroll>
      <Row $padding="0 15px">
        <Title2>Editeur :</Title2>
        <TouchableOpacity
          onPress={() =>
            post.editor &&
            navigation.navigate("officeContainer", {
              screen: "viewOffice",
              params: { office: post.editor },
            })
          }
        >
          <Row>
            <Image source={{ uri: post.editor?.logoUrl }} $size={40} />
            <Text style={{ marginLeft: 10 }}>{post.editor?.name}</Text>
          </Row>
        </TouchableOpacity>
      </Row>
      <Body>
        {post.tags?.length && post.tags.length > 0 && (
          <Row>
            <BodyTitle>Tags : </BodyTitle>
            {post.tags.map((value, index) => (
              <Text key={index}>[{value}] </Text>
            ))}
          </Row>
        )}
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
        <Container style={officeStyles.borderRounded}>
          <Text>{post.description}</Text>
        </Container>
      </Body>
      {post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} resizeMode="contain" />
      )}
    </ContainerScroll>
  );
}
