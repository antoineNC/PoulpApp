import { Alert, Linking, TouchableOpacity, View } from "react-native";
import {
  Body,
  BodyTitle,
  Container,
  Image,
  Link,
  Row,
  Text,
  Title1,
} from "@styledComponents";
import ImageView from "react-native-image-viewing";
import { useStoreMap } from "effector-react";
import { $officeStore } from "@context/officeStore";
import { useState } from "react";
import { ViewClubProps } from "@navigation/navigationTypes";

export default function ViewClubScreen({ navigation, route }: ViewClubProps) {
  const { clubId } = route.params;
  const [showImage, setShowImage] = useState(false);
  const club = useStoreMap({
    store: $officeStore,
    keys: [clubId],
    fn: (officeStore) =>
      officeStore.clubList.find((club) => club.id === clubId),
  });
  if (!club) {
    return <></>;
  }
  const office = useStoreMap({
    store: $officeStore,
    keys: [clubId],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === club.officeId),
  });

  const handlePress = async (url: string) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };
  return (
    <Container>
      <View style={{ alignItems: "center" }}>
        {club.logoUrl && (
          <>
            <TouchableOpacity
              onPress={() => setShowImage(true)}
              style={{ margin: 10 }}
            >
              <Image
                $size={250}
                source={{ uri: club.logoUrl }}
                style={{
                  borderRadius: 5,
                }}
              />
            </TouchableOpacity>
            <ImageView
              images={[{ uri: club.logoUrl }]}
              imageIndex={0}
              visible={showImage}
              onRequestClose={() => setShowImage(false)}
            />
          </>
        )}
        <Title1>{club.name}</Title1>
      </View>
      <Body>
        <Text>{club.description}</Text>
        {club.contact && (
          <Row style={{ flexWrap: "wrap" }}>
            <BodyTitle>Contact : </BodyTitle>
            <Link onPress={() => club.contact && handlePress(club.contact)}>
              {club.contact}
            </Link>
          </Row>
        )}
        {office && (
          <Row>
            <Text>Club géré par : </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("viewOffice", { officeId: office?.id })
              }
            >
              <Row>
                <Image
                  $size={35}
                  source={{ uri: office?.logoUrl }}
                  style={{ marginHorizontal: 5 }}
                />
                <Text $bold>{office?.name}</Text>
              </Row>
            </TouchableOpacity>
          </Row>
        )}
      </Body>
    </Container>
  );
}
