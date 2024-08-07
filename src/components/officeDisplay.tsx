import { Alert, FlatList, Linking, TouchableOpacity, View } from "react-native";
import { Row, Image, Title, Body, Text, Link } from "@styledComponents";
import { colors } from "@theme";
import { CloseButton } from "./closeButton";
import { officeStyles } from "@styles";
import { useEffect, useMemo, useState } from "react";
import { useUnit } from "effector-react";
import { $officeStore } from "@context/officeStore";

export const OfficeDisplay = ({
  item,
  toggleModal,
}: {
  item: Office;
  toggleModal: () => void;
}) => {
  const { clubList, roleList } = useUnit($officeStore);
  const clubs = useMemo(() => {
    return item.clubs
      ?.map((clubId) => clubList.find((club) => club.id === clubId))
      .filter((value) => value !== undefined);
  }, [item.clubs]);
  const members = useMemo(() => {
    return item.members
      ?.map((member) => {
        const role = roleList.find((role) => role.id === member.idRole);
        if (role && member.idStudent)
          return { role: role.id, student: member.idStudent };
      })
      .filter((value) => value !== undefined);
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
          <Title>{item.name}</Title>
        </View>
      </Row>
      <Body>
        <Row>
          <Text>Envoyez nous un mail :</Text>
          <TouchableOpacity onPress={() => handlePress(item.mail)}>
            <Link>{item.mail}</Link>
          </TouchableOpacity>
        </Row>
        <View style={officeStyles.borderRounded}>
          <Text>{item.description}</Text>
        </View>
        <View style={officeStyles.borderRounded}>
          <FlatList
            data={members}
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
        <View>
          <Text style={{ fontWeight: "bold" }}>Liste des clubs :</Text>
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
      </Body>
    </View>
  );
};
