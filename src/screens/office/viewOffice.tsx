import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Linking, TouchableOpacity, View } from "react-native";
import { useUnit } from "effector-react";
import { ViewOfficeProps } from "@navigation/navigationTypes";
import { useStudent } from "@firebase";
import { $officeStore } from "@context/officeStore";
import {
  Row,
  Image,
  Text,
  Link,
  BodyTitle,
  ContainerScroll,
} from "@styledComponents";
import { officeStyles } from "@styles";

export default function ViewOfficeScreen({ route }: ViewOfficeProps) {
  const { office } = route.params;
  const { clubList, partnershipList, roleList } = useUnit($officeStore);
  const { getMemberOffice } = useStudent();
  const [memberOffice, setMemberOffice] = useState<
    { role: string; student: string }[]
  >([]);

  const clubs = useMemo(() => {
    return office.clubs
      ?.map((clubId) => clubList.find((club) => club.id === clubId))
      .filter((value) => value !== undefined);
  }, [office.clubs]);
  const partnerships = useMemo(() => {
    return office.partnerships
      ?.map((partnerId) =>
        partnershipList.find((partner) => partner.id === partnerId)
      )
      .filter((value) => value !== undefined);
  }, [office.partnerships]);

  const setMembers = useCallback(async () => {
    const memberList = [];
    if (office.members) {
      const students = await getMemberOffice(office.id);
      for await (const member of office.members) {
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
  }, [office.members]);

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
    <ContainerScroll style={officeStyles.container}>
      <Row>
        <Text>Envoyez nous un mail : </Text>
        <TouchableOpacity onPress={() => handlePress(office.mail)}>
          <Link>{office.mail}</Link>
        </TouchableOpacity>
      </Row>
      <View style={officeStyles.borderRounded}>
        <BodyTitle>Description :</BodyTitle>
        <Text>{office.description}</Text>
      </View>
      {memberOffice.length > 0 && (
        <View style={officeStyles.borderRounded}>
          <BodyTitle>Liste des membres :</BodyTitle>
          {memberOffice.map((member, index) => (
            <Row key={index} style={{ marginVertical: 5 }}>
              <Text style={{ flex: 1 }}>{member.role} :</Text>
              <Text style={{ flex: 2 }}>{member.student}</Text>
            </Row>
          ))}
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
    </ContainerScroll>
  );
}
