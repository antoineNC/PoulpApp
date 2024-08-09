import { View } from "react-native";
import { Text, Image, Body, Title2, Row } from "@styledComponents";

export const PostItem = ({ post }: { post: Post }) => {
  return (
    <View key={post.id} style={{ rowGap: 10 }}>
      <Row>
        <Image
          source={{ uri: post.editor?.logoUrl }}
          $size={50}
          style={{ marginHorizontal: 5 }}
        />
        <View>
          <Title2>{post.title}</Title2>
          {post.tags?.length && post.tags.length > 0 && (
            <Text>{post.tags}</Text>
          )}
        </View>
      </Row>
      <Body>
        <Text numberOfLines={3}>{post.description}</Text>
      </Body>
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          resizeMode="contain"
          resizeMethod="scale"
        />
      )}
    </View>
  );
};
