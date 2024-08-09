import { View } from "react-native";
import { Text, Image, Body, Row, Title2 } from "@styledComponents";
import { colors } from "@theme";
import { CloseButton } from "./closeButton";

export const PostDisplay = ({
  item,
  toggleModal,
}: {
  item?: { post: Post; office?: Office };
  toggleModal: () => void;
}) => {
  if (item) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary,
          paddingTop: 15,
        }}
      >
        <CloseButton onPress={toggleModal} />
        <Row style={{ marginBottom: 10 }}>
          <Image
            source={{ uri: item.office?.logoUrl }}
            $size={60}
            style={{ marginHorizontal: 10 }}
          />
          <View>
            <Title2>{item.post.title}</Title2>
            {item.post.tags?.length && item.post.tags.length > 0 && (
              <Text>{item.post.tags}</Text>
            )}
          </View>
        </Row>
        <Body>
          <Text>{item.post.description}</Text>
        </Body>
        {item.post.imageUrl && (
          <Image
            source={{ uri: item.post.imageUrl }}
            resizeMode="contain"
            resizeMethod="scale"
          />
        )}
      </View>
    );
  }
  // TODO : Loading screen or error screen
  return <></>;
};
