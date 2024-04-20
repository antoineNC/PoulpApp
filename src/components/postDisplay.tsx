import { View, Image, Dimensions } from "react-native";
import { Text } from "@styledComponents";
import { colors } from "theme";
import { Post } from "types";
import { windowScale } from "data";
import Ionicons from "react-native-vector-icons/Ionicons";

export const PostDisplay = ({ item }: { item?: Post }) => {
  if (item) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary,
          rowGap: 10,
          paddingTop: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="arrow-back-circle-outline" />
          <Image
            source={{ uri: item.editorLogo }}
            width={60}
            style={{ aspectRatio: 1, marginHorizontal: 10 }}
          />
          <View>
            <Text $size="xl">{item.title}</Text>
            {item.tags.length > 0 && <Text>{item.tags}</Text>}
          </View>
        </View>
        <Text style={{ marginHorizontal: 15 }}>{item.description}</Text>
        {item.image && (
          <Image
            source={{ uri: item.image }}
            resizeMode="contain"
            resizeMethod="scale"
            width={windowScale.width}
            style={{ aspectRatio: 1 }}
          />
        )}
      </View>
    );
  } else return <></>;
};
