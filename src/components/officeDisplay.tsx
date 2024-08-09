import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Linking, TouchableOpacity, View } from "react-native";
import { useUnit } from "effector-react";
import { useStudent } from "@firebase";
import { $officeStore } from "@context/officeStore";
import { CloseButton } from "./closeButton";
import { Row, Image, Title2, Body, Text, Link } from "@styledComponents";
import { officeStyles } from "@styles";
import { colors } from "@theme";

export const OfficeDisplay = ({
  item,
  toggleModal,
}: {
  item: Office;
  toggleModal: () => void;
}) => {
  const { clubList, partnershipList, roleList } = useUnit($officeStore);
  const { getStudentById } = useStudent();
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
    const members = [];
    if (item.members) {
      for await (const member of item.members) {
        const role = roleList.find((role) => role.id === member.idRole);
        const student = await getStudentById(member.idStudent);
        if (role && student)
          members.push({
            role: role.name,
            student: `${student.lastName.toUpperCase()} ${student.firstName}`,
          });
      }
    }
    setMemberOffice(members);
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
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primary,
        paddingTop: 15,
      }}
    >
      <CloseButton onPress={toggleModal} />
      <Row style={{ marginBottom: 10 }}>
        <Image
          source={{ uri: item.logoUrl }}
          $size={60}
          style={{ marginHorizontal: 10 }}
        />
        <View>
          <Title2>{item.name}</Title2>
        </View>
      </Row>
      <Body>
        <Row>
          <Text>Envoyez nous un mail : </Text>
          <TouchableOpacity onPress={() => handlePress(item.mail)}>
            <Link>{item.mail}</Link>
          </TouchableOpacity>
        </Row>
        <View style={officeStyles.borderRounded}>
          <Text $bold style={{ paddingVertical: 5 }}>
            Description :
          </Text>
          <Text>{item.description}</Text>
        </View>
        {memberOffice.length > 0 && (
          <View style={officeStyles.borderRounded}>
            <FlatList
              data={memberOffice}
              ListHeaderComponent={
                <Text style={{ fontWeight: "bold" }}>Liste des membres :</Text>
              }
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
            <Text $bold>Liste des clubs :</Text>
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
            <Text $bold>Liste des partenariats :</Text>
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
    </View>
  );
};
