import { FlatList, TouchableOpacity } from "react-native";
import { Button, Card } from "react-native-paper";
import { useUnit } from "effector-react";

import { $officeStore } from "@context/officeStore";
import { Container, Image } from "@styledComponents";
import { ListOfficeProps } from "@navigation/navigationTypes";
import { useRight } from "utils/rights";
import { BodyText, HeaderText } from "components/customText";

export default function ListOfficeScreen({ navigation }: ListOfficeProps) {
  const { officeList } = useUnit($officeStore);
  const { hasRight } = useRight();

  return (
    <Container>
      <FlatList
        data={officeList}
        contentContainerStyle={{
          rowGap: 20,
          paddingHorizontal: 20,
          paddingTop: 5,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              navigation.navigate("viewOffice", { officeId: item.id });
            }}
          >
            <Card style={{ paddingVertical: 20 }}>
              <Card.Title
                title={
                  <HeaderText>
                    {item.name} ({item.acronym})
                  </HeaderText>
                }
                subtitle={<BodyText>{item.mail}</BodyText>}
                left={() => <Image source={{ uri: item.logoUrl }} $size={80} />}
                leftStyle={{ width: 80 }}
                titleNumberOfLines={2}
              />
              <Card.Content style={{ marginVertical: 20 }}>
                <BodyText>{item.description}</BodyText>
              </Card.Content>
              {hasRight("OFFICE", "UPDATE", item.id) && (
                <Card.Actions>
                  <Button
                    mode="contained-tonal"
                    icon="pencil"
                    onPress={() =>
                      navigation.navigate("updateOffice", { officeId: item.id })
                    }
                  >
                    Modifier
                  </Button>
                </Card.Actions>
              )}
            </Card>
          </TouchableOpacity>
        )}
      />
    </Container>
  );
}
