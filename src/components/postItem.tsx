import { View } from "react-native";
import { Text, Image, Body, Title, Row } from "@styledComponents";

export const PostItem = ({ post, office }: { post: Post; office?: Office }) => {
  return (
    <View key={post.id} style={{ rowGap: 10 }}>
      <Row>
        <Image
          source={{ uri: post.editor?.logoUrl }}
          $size={50}
          style={{ marginHorizontal: 5 }}
        />
        <View>
          <Title>{post.title}</Title>
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
