import React, { useCallback } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
  LocaleConfig,
} from "react-native-calendars";
import { useUnit } from "effector-react";
import { useTheme } from "react-native-paper";

import { $calendarStore } from "@context/calendarStore";
import { formatDate } from "utils/dateUtils";
import { AgendaItemType } from "types/calendar.type";
import { BodyText, TitleText } from "./customText";

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
  const { colors } = useTheme();
  const today = formatDate(postDate || new Date());

  const renderItem = useCallback((item: AgendaItemType) => {
    const itemPressed = () => {
      Alert.alert(item.title, item.description);
    };

    return (
      <TouchableOpacity onPress={itemPressed} style={styles.item}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <BodyText>{item.startHour}</BodyText>
          {item.duration && <BodyText>{item.duration}</BodyText>}
        </View>
        <View style={{ flex: 5 }}>
          <TitleText style={styles.itemTitleText}>{item.title}</TitleText>
          <BodyText numberOfLines={2}>{item.description}</BodyText>
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <CalendarProvider date={today} showTodayButton>
      <ExpandableCalendar
        firstDay={1}
        markedDates={markedDates}
        calendarStyle={{ backgroundColor: colors.background }}
        headerStyle={{ backgroundColor: colors.background }}
        theme={{
          monthTextColor: colors.onBackground,
          calendarBackground: colors.background,
          dotColor: colors.primary,
          selectedDotColor: colors.background,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: colors.background,
          todayTextColor: colors.primary,
          dayTextColor: colors.onBackground,
        }}
      />
      <AgendaList
        sections={sections}
        renderItem={({ item }) => renderItem(item)}
        dayFormat={"ddd d MMM"}
        ItemSeparatorComponent={() => (
          <View
            style={{ borderBottomWidth: 1, borderColor: colors.surfaceVariant }}
          />
        )}
        sectionStyle={{
          backgroundColor: colors.surfaceVariant,
          color: colors.onBackground,
        }}
      />
    </CalendarProvider>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 10,
  },
  itemTitleText: {
    marginBottom: 5,
  },
});
