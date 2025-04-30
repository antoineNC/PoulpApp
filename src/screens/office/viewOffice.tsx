import React from "react";
import { FlatList, Linking, TouchableOpacity, View } from "react-native";
import { useStoreMap } from "effector-react";

import { ViewOfficeProps } from "@navigation/navigationTypes";
import { $officeStore } from "@context/officeStore";
import { $studentStore } from "@context/studentStore";
import { useDialog } from "@context/dialog/dialogContext";
import { Row, ContainerScroll } from "@styledComponents";
import { BodyText, LinkText, Title2Text } from "components/customText";
import { SmallCardItem } from "components/smallCardItem";

export default function ViewOfficeScreen({
  navigation,
  route,
}: ViewOfficeProps) {
  const { officeId } = route.params;
  const { showDialog } = useDialog();
  const office = useStoreMap({
    store: $officeStore,
    keys: [officeId],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === officeId),
  });
  const [clubs, partnerships, roles] = useStoreMap({
    store: $officeStore,
    keys: [officeId],
    fn: (officeStore) => {
      const clubs = officeStore.clubList.filter(
        (club) => club.officeId === office?.id
      );
      const partnerships = officeStore.partnershipList.filter(
        (partnership) => partnership.officeId === office?.id
      );
      return [clubs, partnerships, officeStore.roleList];
    },
  });
  const members = useStoreMap({
    store: $studentStore,
    keys: [officeId],
    fn: (students) =>
      office?.members?.map(({ idRole, idStudent }) => {
        const studentMember = students.find(
          (student) => student.id === idStudent
        );
        const roleMember = roles.find((role) => role.id === idRole);
        return {
          role: `${roleMember?.name}`,
          student: `${studentMember?.lastName.toUpperCase()} ${
            studentMember?.firstName
          }`,
        };
      }),
    defaultValue: [],
  });

  if (!office) {
    return <></>;
  }

  const handlePress = async (url: string) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL("mailto:" + url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL("mailto:" + url);
    } else {
      showDialog({ title: `Nous ne parvenons pas à ouvrir ce lien: ${url}` });
    }
  };
  return (
    <ContainerScroll style={{ paddingTop: 5 }}>
      <View style={{ paddingHorizontal: 15 }}>
        <Row $padding="10px 0">
          <Title2Text>Contact : </Title2Text>
          <TouchableOpacity onPress={() => handlePress(office.mail)}>
            <LinkText>{office.mail}</LinkText>
          </TouchableOpacity>
        </Row>
        <View style={{ paddingVertical: 10 }}>
          <Title2Text>Description</Title2Text>
          <BodyText>{office.description}</BodyText>
        </View>
        {members.length > 0 && (
          <View style={{ paddingVertical: 10 }}>
            <Title2Text>Liste des membres</Title2Text>
            {members.map((member, index) => (
              <Row key={index} style={{ marginVertical: 5 }}>
                <BodyText style={{ flex: 1 }}>{member.role} :</BodyText>
                <BodyText style={{ flex: 2 }}>{member.student}</BodyText>
              </Row>
            ))}
          </View>
        )}
      </View>
      {clubs && clubs.length > 0 && (
        <View style={{ paddingVertical: 10 }}>
          <Title2Text style={{ paddingHorizontal: 15 }}>
            Liste des clubs
          </Title2Text>
          <FlatList
            horizontal
            data={clubs}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              columnGap: 10,
              padding: 10,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("viewClub", { clubId: item.id })
                }
              >
                <SmallCardItem
                  key={item.id}
                  title={item.name}
                  logo={item.logoUrl}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {partnerships && partnerships.length > 0 && (
        <View style={{ paddingVertical: 10 }}>
          <Title2Text style={{ paddingHorizontal: 15 }}>
            Liste des partenariats
          </Title2Text>
          <FlatList
            horizontal
            data={partnerships}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ columnGap: 10, padding: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("viewPartnership", {
                    partnershipId: item.id,
                  })
                }
              >
                <SmallCardItem
                  key={item.id}
                  title={item.name}
                  logo={item.logoUrl}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </ContainerScroll>
  );
}
