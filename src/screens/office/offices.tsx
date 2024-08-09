import { useState } from "react";
import { Alert, FlatList, Modal, TouchableOpacity } from "react-native";
import { Button, Card } from "react-native-paper";
import { useUnit } from "effector-react";

import { $officeStore } from "@context/officeStore";
import { Container, Image, Text, Title2 } from "@styledComponents";
import { colors } from "@theme";
import { OfficeDisplay } from "components/officeDisplay";

export default function OfficesScreen() {
  const { officeList } = useUnit($officeStore);
  const [modalVisible, setModalVisible] = useState(false);
  const [displayedOffice, setDisplayedOffice] = useState<Office>(officeList[0]);

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  return (
    <Container>
      <Modal
        visible={modalVisible}
        animationType="fade"
        onRequestClose={toggleModal}
        transparent
      >
        <OfficeDisplay item={displayedOffice} toggleModal={toggleModal} />
      </Modal>
      <FlatList
        data={officeList}
        contentContainerStyle={{ rowGap: 20, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              setDisplayedOffice(item);
              toggleModal();
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
