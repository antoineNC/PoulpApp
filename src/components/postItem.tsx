import { View } from "react-native";
import { Text, Image, Body, Title, Row } from "styles/styledComponents";
import { Post } from "types";

export const PostItem = ({ item }: { item: Post }) => {
  return (
    <View key={item.id} style={{ rowGap: 10 }}>
      <Row>
        <Image
          source={{ uri: item.editorLogo }}
          $size={50}
          style={{ marginHorizontal: 5 }}
        />
        <View>
          <Title>{item.title}</Title>
          {item.tags.length > 0 && <Text>{item.tags}</Text>}
        </View>
      </Row>
      <Body numberOfLines={3}>{item.description}</Body>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          resizeMode="contain"
          resizeMethod="scale"
        />
      )}
    </View>
  );
};
