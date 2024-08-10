import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Linking, TouchableOpacity, View } from "react-native";
import { useUnit } from "effector-react";
import { useStudent } from "@firebase";
import { $officeStore } from "@context/officeStore";
import {
  Row,
  Image,
  Title2,
  Body,
  Text,
  Link,
  ModalContainer,
  BodyTitle,
} from "@styledComponents";
import { CloseButton } from "./closeButton";
import { officeStyles } from "@styles";

export const OfficeDisplay = ({
  item,
  toggleModal,
}: {
  item: Office;
  toggleModal: () => void;
}) => {
  const { clubList, partnershipList, roleList } = useUnit($officeStore);
  const { getMemberOffice } = useStudent();
  const [memberOffice, setMemberOffice] = useState<
    { role: string; student: string }[]
  >([]);

  const clubs = useMemo(() => {
    return item.clubs
      ?.map((clubId) => clubList.find((club) => club.id === clubId))
      .filter((value) => value !== undefined);
  }, [item.clubs]);
  const partnerships = useMemo(() => {
    return item.partnerships
      ?.map((partnerId) =>
        partnershipList.find((partner) => partner.id === partnerId)
      )
      .filter((value) => value !== undefined);
  }, [item.partnerships]);

  const setMembers = useCallback(async () => {
    const memberList = [];
    if (item.members) {
      const students = await getMemberOffice(item.id);
      for await (const member of item.members) {
        const role = roleList.find((role) => role.id === member.idRole);
        const student = students?.find(
          (student) => student.id === member.idStudent
        );
        if (role && student)
          memberList.push({
            role: role.name,
            student: `${student.lastName.toUpperCase()} ${student.firstName}`,
          });
      }
    }
    setMemberOffice(memberList);
  }, [roleList]);

  useEffect(() => {
    setMembers();
  }, [item.members]);

  const handlePress = async (url: string) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL("mailto:" + url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL("mailto:" + url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };
  return (
    <ModalContainer>
      <CloseButton onPress={toggleModal} />
      <Body>
        <Row>
          <Image source={{ uri: item.logoUrl }} $size={60} />
          <View>
            <Title2>{item.name}</Title2>
          </View>
        </Row>
        <Row>
          <Text>Envoyez nous un mail : </Text>
          <TouchableOpacity onPress={() => handlePress(item.mail)}>
            <Link>{item.mail}</Link>
          </TouchableOpacity>
        </Row>
        <View style={officeStyles.borderRounded}>
          <BodyTitle>Description :</BodyTitle>
          <Text>{item.description}</Text>
        </View>
        {memberOffice.length > 0 && (
          <View style={officeStyles.borderRounded}>
            <FlatList
              data={memberOffice}
              ListHeaderComponent={<BodyTitle>Liste des membres :</BodyTitle>}
              renderItem={({ item }) => (
                <Row style={{ marginVertical: 5 }}>
                  <Text style={{ flex: 1 }}>{item.role} :</Text>
                  <Text style={{ flex: 2 }}>{item.student}</Text>
                </Row>
              )}
            />
          </View>
        )}
        {clubs && clubs.length > 0 && (
          <View>
            <BodyTitle>Liste des clubs :</BodyTitle>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={clubs}
              renderItem={({ item }) => (
                <View style={{ margin: 10, alignItems: "center" }}>
                  <Image
                    source={{ uri: item.logoUrl }}
                    $size={100}
                    style={{ borderRadius: 5 }}
                  />
                  <Text>{item.name}</Text>
                </View>
              )}
            />
          </View>
        )}
        {partnerships && partnerships.length > 0 && (
          <View>
            <BodyTitle>Liste des partenariats :</BodyTitle>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={partnerships}
              renderItem={({ item }) => (
                <View style={{ margin: 10, alignItems: "center" }}>
                  <Image
                    source={{ uri: item.logoUrl }}
                    $size={100}
                    style={{ borderRadius: 5 }}
                  />
                  <Text>{item.name}</Text>
                </View>
              )}
            />
          </View>
        )}
      </Body>
    </ModalContainer>
  );
};
