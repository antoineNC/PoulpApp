import { Alert, Linking, TouchableOpacity, View } from "react-native";
import { Body, Container, Image, Row } from "@styledComponents";
import ImageView from "react-native-image-viewing";
import { useStoreMap } from "effector-react";
import { $officeStore } from "@context/officeStore";
import { useState } from "react";
import React from "react";
import { BodyText, HeaderText, LinkText } from "./customText";

export default function ClubDisplay({
  id,
  onPress,
}: {
  id: string;
  onPress: (officeId: string) => void;
}) {
  const [showImage, setShowImage] = useState(false);
  const club = useStoreMap({
    store: $officeStore,
    keys: [id],
    fn: (officeStore) => officeStore.clubList.find((club) => club.id === id),
  });
  const office = useStoreMap({
    store: $officeStore,
    keys: [id],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === club?.officeId),
  });

  if (!club) {
    return <></>;
  }

  const handlePress = async (url: string) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Nous ne parvenons pas à ouvrir ce lien: ${url}`);
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
        <HeaderText>{club.name}</HeaderText>
      </View>
      <Body>
        <BodyText>{club.description}</BodyText>
        {club.contact && (
          <Row style={{ flexWrap: "wrap" }}>
            <BodyText>Contact : </BodyText>
            <TouchableOpacity
              onPress={() => club.contact && handlePress(club.contact)}
            >
              <LinkText>{club.contact}</LinkText>
            </TouchableOpacity>
          </Row>
        )}
        {office && (
          <Row>
            <BodyText>Club géré par : </BodyText>
            <TouchableOpacity onPress={() => onPress(office.id)}>
              <Row>
                <Image
                  $size={35}
                  source={{ uri: office?.logoUrl }}
                  style={{ marginHorizontal: 5 }}
                />
                <BodyText>{office?.name}</BodyText>
              </Row>
            </TouchableOpacity>
          </Row>
        )}
      </Body>
    </Container>
  );
}
