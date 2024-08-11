import { View } from "react-native";
import {
  Text,
  Image,
  Body,
  Row,
  Title2,
  ContainerScroll,
} from "@styledComponents";
import { ViewPostProps } from "@navigation/navigation.types";

export default function ViewPostScreen({ route }: ViewPostProps) {
  const { post } = route.params;
  return (
    <ContainerScroll>
      <Row $padding="0 15px">
        <Image source={{ uri: post.editor?.logoUrl }} $size={60} />
        <View>
          <Title2>{post.title}</Title2>
          {post.tags?.length && post.tags.length > 0 && (
            <Text>{post.tags[0]}</Text>
          )}
        </View>
      </Row>
      <Body>
        <Text>{post.description}</Text>
      </Body>
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          resizeMode="contain"
          resizeMethod="scale"
        />
      )}
    </ContainerScroll>
  );
}
