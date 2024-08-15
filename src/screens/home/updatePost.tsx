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
import { UpdatePostProps } from "@navigation/navigationTypes";
import { officeStyles } from "@styles";

type FieldNames = {
  title: string;
  description: string;
  date: number;
  tags: string[];
  editorId: string;
  imageFile: string;
};

export default function UpdatePostScreen({
  navigation,
  route,
}: UpdatePostProps) {
  const { post } = route.params;
  return (
    <ContainerScroll>
      <Row $padding="0 15px">
        <Title2>Editeur :</Title2>
        <Image source={{ uri: post.editor?.logoUrl }} $size={40} />
        <Text style={{ marginLeft: 10 }}>{post.editor?.name}</Text>
      </Row>
      {post.tags?.length && post.tags.length > 0 && (
        <Container
          style={[officeStyles.borderRounded, { marginHorizontal: 15 }]}
        >
          <Row>
            <BodyTitle>Tags : </BodyTitle>
            {post.tags.map((value, index) => (
              <Text key={index}>[{value}] </Text>
            ))}
          </Row>
        </Container>
      )}
      <Body>
        <Text>{post.description}</Text>
      </Body>
      {post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} resizeMode="contain" />
      )}
    </ContainerScroll>
  );
}
