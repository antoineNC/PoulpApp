import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Checkbox, Searchbar, useTheme } from "react-native-paper";
import { useUnit } from "effector-react";
import Spinner from "react-native-loading-spinner-overlay";

import { ListAdherentProps } from "@navigation/navigationTypes";
import { updateStudentAdhesion } from "@fb/service/student.service";
import { $studentStore } from "@context/studentStore";
import { $sessionStore } from "@context/sessionStore";
import { useDialog } from "@context/dialog/dialogContext";
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

  const officeId = userId;
  const { colors } = useTheme();
  const { showDialog } = useDialog(); // FIXME: rerender when dismissing dialog via outside press
  const studentList = useUnit($studentStore);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const filter = studentList
    .sort((studA, studB) => studA.lastName.localeCompare(studB.lastName))
    .filter((el) => {
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
                showDialog({
                  title: "Fin de l'adhésion",
                  message: `Souhaitez-vous mettre fin à l'adhésion de ${item.firstName} ${item.lastName}`,
                  buttons: [
                    { text: "OUI", onPress: () => onSubmit(item.id, false) },
                    { text: "NON" },
                  ],
                });
              } else {
                showDialog({
                  title: "Confirmer l'adhésion",
                  message: `Souhaitez-vous confirmer l'adhésion de ${item.firstName} ${item.lastName}`,
                  buttons: [
                    { text: "OUI", onPress: () => onSubmit(item.id, true) },
                    { text: "NON" },
                  ],
                });
              }
            }}
          />
        )}
      />
    </Container>
  );
}
