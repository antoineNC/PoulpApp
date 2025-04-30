import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { Checkbox, Searchbar, useTheme } from "react-native-paper";
import { useUnit } from "effector-react";
import Spinner from "react-native-loading-spinner-overlay";

import { ListAdherentProps } from "@navigation/navigationTypes";
import { updateStudentAdhesion } from "@fb/service/student.service";
import { $studentStore } from "@context/studentStore";
import { $sessionStore } from "@context/sessionStore";
import { handleError } from "utils/errorUtils";
import { notificationToast } from "utils/toast";
import { useRight } from "utils/rights";
import { Container } from "@styledComponents";

export default function ListAdherent({ navigation }: ListAdherentProps) {
  const { userId } = useUnit($sessionStore);

  const { hasRight } = useRight();
  useEffect(() => {
    if (!hasRight("OFFICE", "UPDATE", userId))
      navigation.navigate("homeContainer", { screen: "feed" });
  }, [hasRight, navigation, userId]);

  const { colors } = useTheme();
  const officeId = userId;
  const studentList = useUnit($studentStore);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      await updateStudentAdhesion(officeId, studentId, isAdherent);
      notificationToast("success", "Adhésion mise à jour.");
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {loading && (
        <Spinner
          visible={loading}
          textContent={"Chargement..."}
          textStyle={{ color: colors.onBackground }}
        />
      )}
      <Searchbar
        placeholder="Chercher un nom"
        onChangeText={setQuery}
        value={query}
        style={{ borderRadius: 5, marginHorizontal: 10 }}
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
