import { View, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Text, Image, Body, Row, Title } from "@styledComponents";
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
            source={{ uri: item.office?.logo }}
            $size={60}
            style={{ marginHorizontal: 10 }}
          />
          <View>
            <Title>{item.post.title}</Title>
            {item.post.tags?.length && item.post.tags.length > 0 && (
              <Text>{item.post.tags}</Text>
            )}
          </View>
        </Row>
        <Body>
          <Text>{item.post.description}</Text>
        </Body>
        {item.post.image && (
          <Image
            source={{ uri: item.post.image }}
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
