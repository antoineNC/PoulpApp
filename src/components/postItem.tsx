import { Alert, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { Text, Image, Body, Title2, Row } from "@styledComponents";
import { HomeProps } from "@navigation/navigationTypes";
import { useUnit } from "effector-react";
import { $sessionStore } from "@context/sessionStore";

type PostItemProps = Partial<HomeProps> & { post: Post };

export const PostItem = ({ post, navigation }: PostItemProps) => {
  const { role } = useUnit($sessionStore);
  return (
    <View key={post.id}>
      <Row $padding="0 15px">
        <TouchableOpacity
          onPress={() =>
            navigation &&
            post.editor &&
            navigation?.navigate("officeContainer", {
              screen: "viewOffice",
              params: { office: post.editor },
            })
          }
        >
          <Image source={{ uri: post.editor?.logoUrl }} $size={50} />
        </TouchableOpacity>
        <View>
          <Title2>{post.title}</Title2>
          <Row $padding="0 10px">
            {post.tags?.length &&
              post.tags.length > 0 &&
              post.tags.map((value, index) => (
                <Text key={index}>[{value}] </Text>
              ))}
          </Row>
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
      {["OFFICE_ROLE", "ADMIN_ROLE"].includes(role) && (
        <Row $justify="space-around" $padding="10px 0 0">
          <Button
            mode="contained-tonal"
            icon="pencil"
            onPress={() => navigation?.navigate("updatePost", { post })}
          >
            Modifier
          </Button>
          <Button
            mode="contained-tonal"
            icon="delete"
            onPress={() =>
              Alert.alert("Suppression", "Veux-tu vraiment supprimer ce post ?")
            }
          >
            Supprimer
          </Button>
        </Row>
      )}
    </View>
  );
};
