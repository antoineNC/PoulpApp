import { Alert, FlatList, Linking, TouchableOpacity, View } from "react-native";
import { useStoreMap } from "effector-react";
import { ViewOfficeProps } from "@navigation/navigationTypes";
import { $officeStore } from "@context/officeStore";
import { $studentStore } from "@context/studentStore";
import {
  Row,
  Image,
  Text,
  Link,
  BodyTitle,
  ContainerScroll,
} from "@styledComponents";
import { officeStyles } from "@styles";
import { colors } from "@theme";

export default function ViewOfficeScreen({
  navigation,
  route,
}: ViewOfficeProps) {
  const { officeId } = route.params;
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
      {members.length > 0 && (
        <View style={officeStyles.borderRounded}>
          <BodyTitle>Liste des membres :</BodyTitle>
          {members.map((member, index) => (
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
              <TouchableOpacity
                style={{ margin: 10, alignItems: "center" }}
                onPress={() =>
                  navigation.navigate("viewClub", { clubId: item.id })
                }
              >
                <Image
                  source={
                    item.logoUrl
                      ? { uri: item.logoUrl }
                      : require("@assets/no_image_available.png")
                  }
                  $size={100}
                  style={{
                    borderRadius: 5,
                    width: 100,
                    height: 100,
                    backgroundColor: colors.secondary,
                  }}
                />
                <Text>{item.name}</Text>
              </TouchableOpacity>
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
              <TouchableOpacity
                style={{ margin: 10, alignItems: "center" }}
                onPress={() =>
                  navigation.navigate("viewPartnership", {
                    partnershipId: item.id,
                  })
                }
              >
                <Image
                  source={
                    item.logoUrl
                      ? { uri: item.logoUrl }
                      : require("@assets/no_image_available.png")
                  }
                  $size={100}
                  style={{
                    borderRadius: 5,
                    width: 100,
                    height: 100,
                    backgroundColor: colors.secondary,
                  }}
                />
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </ContainerScroll>
  );
}
