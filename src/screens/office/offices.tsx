import { useState } from "react";
import { Alert, Modal, TouchableOpacity } from "react-native";
import { Button, Card } from "react-native-paper";
import { useUnit } from "effector-react";

import { $officesStore } from "@context/officeStore";
import { Container, Image, Text, Title } from "@styledComponents";
import { officeStyles } from "@styles";
import { colors } from "@theme";
import { OfficeDisplay } from "components/officeDisplay";

export default function OfficesScreen() {
  const offices = useUnit($officesStore);
  const [modalVisible, setModalVisible] = useState(false);
  const [displayedOffice, setDisplayedOffice] = useState<OfficeType>();

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  return (
    <Container
      key={"officeContainer"}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={officeStyles.container}
    >
      <Modal
        visible={modalVisible}
        animationType="fade"
        onRequestClose={toggleModal}
        transparent
      >
        <OfficeDisplay item={displayedOffice} toggleModal={toggleModal} />
      </Modal>
      {offices.map((office) => (
        <TouchableOpacity
          onPress={() => {
            setDisplayedOffice(office);
            toggleModal();
          }}
        >
          <Card
            key={office.id}
            style={{
              backgroundColor: colors.primary,
              borderWidth: 0.5,
              borderColor: colors.secondary,
            }}
          >
            <Card.Title
              title={
                <Title>
                  {office.name} ({office.acronym})
                </Title>
              }
              subtitle={<Text>{office.mail}</Text>}
              left={() => <Image source={{ uri: office.logo }} $size={80} />}
              leftStyle={{ width: 80, aspectRatio: 1 }}
              style={{ height: 100 }}
            />
            <Card.Content>
              <Text>{office.description}</Text>
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
      ))}
    </Container>
  );
}
