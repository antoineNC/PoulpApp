import { Alert, FlatList, TouchableOpacity } from "react-native";
import { Button, Card } from "react-native-paper";
import { useUnit } from "effector-react";

import { $officeStore } from "@context/officeStore";
import { Container, Image, Text, Title2 } from "@styledComponents";
import { colors } from "@theme";
import { OfficesProps } from "@navigation/navigation.types";

export default function OfficesScreen({ navigation }: OfficesProps) {
  const { officeList } = useUnit($officeStore);

  return (
    <Container>
      <FlatList
        data={officeList}
        contentContainerStyle={{ rowGap: 20, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              navigation.navigate("viewOffice", { office: item });
            }}
          >
            <Card
              style={{
                backgroundColor: colors.primary,
                borderWidth: 0.5,
                borderColor: colors.secondary,
              }}
            >
              <Card.Title
                title={
                  <Title2>
                    {item.name} ({item.acronym})
                  </Title2>
                }
                subtitle={<Text>{item.mail}</Text>}
                left={() => <Image source={{ uri: item.logoUrl }} $size={80} />}
                leftStyle={{ width: 80, aspectRatio: 1 }}
                style={{ height: 100 }}
              />
              <Card.Content>
                <Text>{item.description}</Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="contained"
                  icon="pencil"
                  onPress={() => Alert.alert("kaehdv")}
                >
                  Modifier
                </Button>
              </Card.Actions>
            </Card>
          </TouchableOpacity>
        )}
      />
    </Container>
  );
}
