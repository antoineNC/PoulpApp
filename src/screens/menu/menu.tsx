import { MenuProps } from "@navigation/navigationTypes";
import { ContainerScroll, Row, Text } from "@styledComponents";
import { TouchableOpacity } from "react-native";
import { Divider, Icon } from "react-native-paper";

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
      <Text $size="l">{text}</Text>
      <Icon size={20} source={"chevron-right"} color="white" />
    </Row>
  </TouchableOpacity>
);

export default function MenuScreen({ navigation }: MenuProps) {
  return (
    <ContainerScroll>
      <Divider />
      <Item text="Mes adhésions" />
      <Divider />
      <Item text="Calendrier" />
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
      <Item text="Se déconnecter" />
      <Divider />
    </ContainerScroll>
  );
}
