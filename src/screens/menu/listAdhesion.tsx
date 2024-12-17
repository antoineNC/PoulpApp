import { $officeStore } from "@context/officeStore";
import { $sessionStore } from "@context/sessionStore";
import { $studentStore } from "@context/studentStore";
import { Container, Image } from "@styledComponents";
import { useStoreMap, useUnit } from "effector-react";
import { FlatList, View } from "react-native";
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
        contentContainerStyle={{
          rowGap: 10,
          padding: 10,
        }}
        renderItem={({ item }) => (
          <Card contentStyle={{ flexDirection: "row" }}>
            <Card.Title
              title={item.name}
              subtitle={item.description}
              style={{ flex: 1 }}
              left={(props) => (
                <View style={{ overflow: "hidden" }}>
                  <Image
                    source={
                      item.logoUrl
                        ? { uri: item.logoUrl }
                        : require("@assets/no_image_available.png")
                    }
                    $size={props.size}
                    style={{
                      width: props.size,
                      height: props.size,
                    }}
                  />
                </View>
              )}
            />
          </Card>
        )}
      />
    </Container>
  );
}
