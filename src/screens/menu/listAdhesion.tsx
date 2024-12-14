import { $officeStore } from "@context/officeStore";
import { $sessionStore } from "@context/sessionStore";
import { $studentStore } from "@context/studentStore";
import { Container } from "@styledComponents";
import { useStoreMap, useUnit } from "effector-react";
import { FlatList } from "react-native";
import { Card } from "react-native-paper";

export default function ListAdhesion() {
  const { userId } = useUnit($sessionStore);
  const student = useStoreMap({
    store: $studentStore,
    keys: [userId],
    fn: (studentList) => {
      return studentList.find((value) => value.id === userId);
    },
  });
  const listOffice = useStoreMap({
    store: $officeStore,
    keys: [userId],
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
