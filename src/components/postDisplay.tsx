import { View, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Text, Image, Body, Row, Title } from "@styledComponents";
import { colors } from "@theme";
import { Post } from "@types";

export const PostDisplay = ({
  item,
  toggleModal,
}: {
  item?: Post;
  toggleModal: () => void;
}) => {
  if (item) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary,
          opacity: 0.98,
          paddingTop: 15,
        }}
      >
        <TouchableOpacity
          onPress={toggleModal}
          style={{ alignSelf: "flex-end" }}
        >
          <Ionicons
            name="close-circle-outline"
            size={35}
            color={colors.white}
            style={{ alignSelf: "flex-end", marginRight: 15 }}
          />
        </TouchableOpacity>
        <Row style={{ marginBottom: 10 }}>
          <Image
            source={{ uri: item.editorLogo }}
            $size={60}
            style={{ marginHorizontal: 10 }}
          />
          <View>
            <Title>{item.title}</Title>
            {item.tags.length > 0 && <Text>{item.tags}</Text>}
          </View>
        </Row>
        <Body>{item.description}</Body>
        {item.image && (
          <Image
            source={{ uri: item.image }}
            resizeMode="contain"
            resizeMethod="scale"
          />
        )}
      </View>
    );
  } else return <></>;
};
