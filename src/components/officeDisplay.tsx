import { FlatList, View } from "react-native";
import { Row, Image, Title, Body, Text } from "@styledComponents";
import { colors } from "@theme";
import { CloseButton } from "./closeButton";

export const OfficeDisplay = ({
  item,
  toggleModal,
}: {
  item: Office | undefined;
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
            source={{ uri: item.logo }}
            $size={60}
            style={{ marginHorizontal: 10 }}
          />
          <View>
            <Title>{item.name}</Title>
            {/* {item.tags.length > 0 && <Text>{item.tags}</Text>} */}
          </View>
        </Row>
        <Body>{item.description}</Body>
        <FlatList
          horizontal
          data={item.clubs}
          renderItem={(club) => (
            <View>
              <Text>{club.item}</Text>
            </View>
          )}
        />
        {/* {item.image && (
          <Image
            source={{ uri: item.image }}
            resizeMode="contain"
            resizeMethod="scale"
          />
        )} */}
      </View>
    );
  }
  return <></>;
};
