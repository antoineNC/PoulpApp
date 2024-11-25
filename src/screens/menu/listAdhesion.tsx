import { $officeStore } from "@context/officeStore";
import { $sessionStore } from "@context/sessionStore";
import { Container } from "@styledComponents";
import { useStoreMap, useUnit } from "effector-react";
import { FlatList } from "react-native";
import { Card } from "react-native-paper";

export default function ListAdhesion() {
  const { user, student } = useUnit($sessionStore);
  const listOffice = useStoreMap({
    store: $officeStore,
    keys: [user.id],
    fn: (officeStore) => {
      const list = officeStore.officeList.filter((el) =>
        student?.adhesion?.includes(el.id)
      );
      return list;
    },
  });
  return (
    <Container>
      <FlatList
        data={listOffice}
        contentContainerStyle={{ paddingHorizontal: 20, rowGap: 30 }}
        renderItem={({ item }) => (
          <Card>
            <Card.Title title={item.name} />
          </Card>
        )}
      />
    </Container>
  );
}
