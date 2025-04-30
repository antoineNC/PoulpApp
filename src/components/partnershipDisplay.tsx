import React, { useState } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import ImageView from "react-native-image-viewing";
import { useStoreMap } from "effector-react";

import { $officeStore } from "@context/officeStore";
import { useDialog } from "@context/dialog/dialogContext";
import {
  BodyText,
  HeaderText,
  LinkText,
  Title2Text,
} from "components/customText";
import { Body, ContainerScroll, Image, Row } from "@styledComponents";

export default function PartnershipDisplay({
  id,
  onPress,
}: {
  id: string;
  onPress: (officeId: string) => void;
}) {
  const [showImage, setShowImage] = useState(false);
  const { showDialog } = useDialog();
  const partnership = useStoreMap({
    store: $officeStore,
    keys: [id],
    fn: (officeStore) =>
      officeStore.partnershipList.find((partner) => partner.id === id),
  });
  const office = useStoreMap({
    store: $officeStore,
    keys: [id],
    fn: (officeStore) =>
      officeStore.officeList.find(
        (office) => office.id === partnership?.officeId
      ),
  });

  if (!partnership) {
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
      showDialog({ title: `Nous ne parvenons pas à ouvrir ce lien: ${url}` });
    }
  };
  return (
    <ContainerScroll>
      <View style={{ alignItems: "center" }}>
        {partnership.logoUrl && (
          <>
            <TouchableOpacity
              onPress={() => setShowImage(true)}
              style={{ margin: 10 }}
            >
              <Image
                $size={250}
                source={{ uri: partnership.logoUrl }}
                style={{
                  borderRadius: 5,
                }}
              />
            </TouchableOpacity>
            <ImageView
              images={[{ uri: partnership.logoUrl }]}
              imageIndex={0}
              visible={showImage}
              onRequestClose={() => setShowImage(false)}
            />
          </>
        )}
        <HeaderText>{partnership.name}</HeaderText>
      </View>
      <Body>
        <BodyText>{partnership.description}</BodyText>
        {partnership.address && (
          <Row style={{ flexWrap: "wrap" }}>
            <BodyText>Adresse : </BodyText>
            {partnership.addressMap ? (
              <TouchableOpacity
                onPress={() =>
                  partnership.addressMap && handlePress(partnership.addressMap)
                }
              >
                <LinkText>{partnership.address}</LinkText>
              </TouchableOpacity>
            ) : (
              <BodyText>{partnership.address}</BodyText>
            )}
          </Row>
        )}
        {partnership.benefits && partnership.benefits.length > 0 && (
          <View>
            <Title2Text>Les avantages du partenariat :</Title2Text>
            <View style={{ margin: 10, rowGap: 10 }}>
              {partnership.benefits.map((benefit, index) => (
                <BodyText key={index}>
                  {index + 1}. {benefit}
                </BodyText>
              ))}
            </View>
          </View>
        )}
        {office && (
          <Row>
            <BodyText>Partneriat du : </BodyText>
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
    </ContainerScroll>
  );
}
