import { PreferencesContext } from "@context/themeContext";
import { signoutUser } from "@fb/service/auth.service";
import { MenuProps } from "@navigation/navigationTypes";
import { ContainerScroll, Row } from "@styledComponents";
import { TitleText } from "components/customText";
import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { Divider, Icon, Switch } from "react-native-paper";
import { useRight } from "utils/rights";

const Item = ({ text, onPress }: { text: string; onPress?: () => void }) => (
  <TouchableOpacity onPress={onPress}>
    <Row
      style={{
        justifyContent: "space-between",
        paddingLeft: 30,
        paddingRight: 20,
        marginVertical: 20,
      }}
    >
      <TitleText>{text}</TitleText>
      <Icon size={20} source={"chevron-right"} />
    </Row>
  </TouchableOpacity>
);

export default function MenuScreen({ navigation }: MenuProps) {
  const { isStudent, isOffice } = useRight();
  const { toggleTheme, isThemeDark: isThemeLight } =
    useContext(PreferencesContext);
  return (
    <ContainerScroll>
      {isStudent && (
        <>
          <Divider />
          <Item
            text="Mes adhésions"
            onPress={() => navigation.navigate("listAdhesion")}
          />
        </>
      )}
      {isOffice && (
        <>
          <Divider />
          <Item
            text="Mes adhérent.es"
            onPress={() => navigation.navigate("listAdherent")}
          />
        </>
      )}
      <Divider />
      <Item text="Calendrier" onPress={() => navigation.navigate("calendar")} />
      <Divider />
      <Item
        text="Liste de clubs"
        onPress={() => navigation.navigate("listClub")}
      />
      <Divider />
      <Item
        text="Liste des partenariats"
        onPress={() => navigation.navigate("listPartnership")}
      />
      <Divider />
      <Item text="Notifications" />
      <Divider />
      <Item text="Détails" />
      <Divider />
      <Item text="Se déconnecter" onPress={signoutUser} />
      <Divider />
      <Row
        style={{
          justifyContent: "flex-end",
          columnGap: 20,
          paddingRight: 20,
          marginVertical: 20,
        }}
      >
        <TitleText>Mode sombre</TitleText>
        <Switch value={isThemeLight} onValueChange={toggleTheme} />
      </Row>
    </ContainerScroll>
  );
}
