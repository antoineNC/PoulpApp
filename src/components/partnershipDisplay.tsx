import { Alert, Linking, TouchableOpacity, View } from "react-native";
import {
  Body,
  BodyTitle,
  ContainerScroll,
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
import { ViewPartnershipProps } from "@navigation/navigationTypes";

export default function PartnershipDisplay({
  id,
  onPress,
}: {
  id: string;
  onPress: (officeId: string) => void;
}) {
  const [showImage, setShowImage] = useState(false);
  const partnership = useStoreMap({
    store: $officeStore,
    keys: [id],
    fn: (officeStore) =>
      officeStore.partnershipList.find((partner) => partner.id === id),
  });
  if (!partnership) {
    return <></>;
  }
  const office = useStoreMap({
    store: $officeStore,
    keys: [id],
    fn: (officeStore) =>
      officeStore.officeList.find(
        (office) => office.id === partnership.officeId
      ),
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
        <Title1>{partnership.name}</Title1>
      </View>
      <Body>
        <Text>{partnership.description}</Text>
        {partnership.address && (
          <Row style={{ flexWrap: "wrap" }}>
            <BodyTitle>Contact : </BodyTitle>
            {partnership.addressMap ? (
              <Link
                onPress={() =>
                  partnership.addressMap && handlePress(partnership.addressMap)
                }
              >
                {partnership.address}
              </Link>
            ) : (
              <Text>{partnership.address}</Text>
            )}
          </Row>
        )}
        {partnership.benefits && partnership.benefits.length > 0 && (
          <View>
            <BodyTitle>Les avantages du partenariat :</BodyTitle>
            <View style={{ margin: 10, rowGap: 10 }}>
              {partnership.benefits.map((benefit, index) => (
                <Text $size="l" key={index}>
                  {index + 1}. {benefit}
                </Text>
              ))}
            </View>
          </View>
        )}
        {office && (
          <Row>
            <Text>Partneriat du : </Text>
            <TouchableOpacity onPress={() => onPress(office.id)}>
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
    </ContainerScroll>
  );
}
