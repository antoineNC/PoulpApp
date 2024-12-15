import React, { useCallback } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
  LocaleConfig,
} from "react-native-calendars";
import { formatDate } from "utils/dateUtils";
import { Text } from "@styledComponents";
import { colors } from "@theme";
import { AgendaItemType } from "types/calendar.type";
import { useUnit } from "effector-react";
import { $calendarStore } from "@context/calendar.store";

LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "fr";

export default function CalendarDisplay({ postDate }: { postDate?: Date }) {
  const { sections, markedDates } = useUnit($calendarStore);
  const today = formatDate(postDate || new Date());

  const AgendaItem = (props: { item: AgendaItemType }) => {
    const { item } = props;
    const itemPressed = useCallback(() => {
      Alert.alert(item.title);
    }, [item.title]);

    return (
      <TouchableOpacity onPress={itemPressed} style={styles.item}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text $dark>{item.startHour}</Text>
          {item.duration && (
            <Text $size="s" style={styles.itemDurationText}>
              {item.duration}
            </Text>
          )}
        </View>
        <View style={{ flex: 5 }}>
          <Text $size="l" $bold $dark style={styles.itemTitleText}>
            {item.title}
          </Text>
          <Text $dark numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = useCallback((item: AgendaItemType) => {
    return <AgendaItem item={item} />;
  }, []);

  return (
    <CalendarProvider date={today} showTodayButton>
      <ExpandableCalendar firstDay={1} markedDates={markedDates} />
      <AgendaList
        sections={sections}
        renderItem={({ item }) => renderItem(item)}
        dayFormat={"ddd d MMM"}
        sectionStyle={styles.section}
      />
    </CalendarProvider>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.secondary,
    color: "black",
    textTransform: "lowercase",
  },
  item: {
    padding: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.black,
    flexDirection: "row",
  },
  itemDurationText: {
    color: "grey",
  },
  itemTitleText: {
    marginBottom: 5,
  },
});
