import { $studentStore } from "@context/studentStore";
import { useStudent } from "@firebase";
import { Container } from "@styledComponents";
import { useUnit } from "effector-react";
import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { Checkbox, Searchbar } from "react-native-paper";

export default function ListAdherent() {
  // TODO :  GET OFFICE ID
  const officeId = "ZN39sNfvmfeMxUU0jxZkCUjVgT23";
  const { setStudentAdhesion } = useStudent();
  const studentList = useUnit($studentStore);
  const sortedStudentList = studentList.sort((studA, studB) =>
    studA.lastName.localeCompare(studB.lastName)
  );
  const [query, setQuery] = useState("");

  const filter = sortedStudentList.filter((el) => {
    const queryUpper = query.toUpperCase();
    return (
      el.firstName.toUpperCase().indexOf(queryUpper) > -1 ||
      el.lastName.toUpperCase().indexOf(queryUpper) > -1
    );
  });

  const onSubmit = async (studentId: string, isAdherent: boolean) => {
    await setStudentAdhesion(officeId, studentId, isAdherent);
    // TODO : LOADING SCREEN
  };

  return (
    <Container>
      <Searchbar
        placeholder="Chercher un nom"
        onChangeText={setQuery}
        value={query}
      />
      <FlatList
        data={filter}
        renderItem={({ item }) => (
          <Checkbox.Item
            label={`${item.firstName} ${item.lastName}`}
            status={item.adhesion?.includes(officeId) ? "checked" : "unchecked"}
            onPress={() => {
              if (item.adhesion?.includes(officeId)) {
                Alert.alert(
                  "Fin de l'adhésion",
                  `Souhaitez-vous mettre fin à l'adhésion de ${item.firstName} ${item.lastName}`,
                  [
                    { text: "OUI", onPress: () => onSubmit(item.id, false) },
                    { text: "NON" },
                  ]
                );
              } else {
                Alert.alert(
                  "Confirmer l'adhésion",
                  `Souhaitez-vous confirmer l'adhésion de ${item.firstName} ${item.lastName}`,
                  [
                    { text: "OUI", onPress: () => onSubmit(item.id, true) },
                    { text: "NON" },
                  ]
                );
              }
            }}
          />
        )}
      />
    </Container>
  );
}
