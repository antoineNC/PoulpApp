import { View, Image, Dimensions } from "react-native";
import { Text } from "@styledComponents";
import { Post } from "types";
import { windowScale } from "data";

export const PostItem = ({ item }: { item: Post }) => {
  return (
    <View key={item.id} style={{ marginBottom: 15, rowGap: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: item.editorLogo }}
          width={50}
          style={{ aspectRatio: 1, marginHorizontal: 5 }}
        />
        <View>
          <Text $size="l">{item.title}</Text>
          {item.tags.length > 0 && <Text>{item.tags}</Text>}
        </View>
      </View>
      <Text style={{ marginHorizontal: 15 }} numberOfLines={3}>
        {item.description}
      </Text>
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
};
