import React, { useCallback, useMemo } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@styledComponents";
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
} from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";
import { isEmpty, groupBy } from "lodash";
import { useUnit } from "effector-react";
import { $postStore } from "@context/postStore";
import { MarkedDates } from "react-native-calendars/src/types";
import {
  displayDateFromTimestamp,
  formatDate,
  formatHour,
  getDuration,
} from "utils/dateUtils";
import { colors } from "@theme";

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

type AgendaItem = {
  title: string;
  description?: string;
  startDate: string;
  startHour: string;
  duration: string;
};
type SectionType = {
  title: string; // date yyyy-MM-dd
  data: AgendaItem[];
};

export default function CalendarScreen() {
  const today = new Date().toISOString().split("T")[0];
  const { posts } = useUnit($postStore);

  const { sections, markedDates } = useMemo(() => {
    const agendaItems: AgendaItem[] = [];
    posts
      .filter((post) => post.date !== undefined)
      .forEach((post) => {
        if (post.date?.start && post.date.end) {
          const { allday, date } = displayDateFromTimestamp({
            start: post.date.start,
            end: post.date.end,
          });
          const duration = allday ? "" : getDuration(date.start, date.end);
          agendaItems.push({
            title: post.title,
            description: post.description,
            startDate: formatDate(post.date.start.toDate()),
            startHour: allday
              ? "Journée entière"
              : formatHour(post.date.start.toDate()),
            duration,
          });
        }
      });

    const agendaItemsGroupped = groupBy(
      agendaItems,
      (item) => item.startDate
    ) as {
      [date: string]: AgendaItem[];
    };

    const sections: SectionType[] = [];
    const markedDates: MarkedDates = {};
    Object.keys(agendaItemsGroupped).forEach((key) => {
      if (agendaItemsGroupped[key]) {
        const agendaItemsSorted = agendaItemsGroupped[key].sort(
          (item1, item2) => {
            if (item1.duration) {
              return item1.startHour.localeCompare(item2.startHour);
            } else {
              // S'il n'y a pas de durée, alors "Journée entière", donc événement doit être placé en premier
              return -1;
            }
          }
        );
        sections.push({ title: key, data: agendaItemsSorted });
        markedDates[key] = { marked: true };
      }
    });

    return { sections, markedDates };
  }, [posts]);

  const AgendaItem = (props: { item: AgendaItem }) => {
    const { item } = props;
    const itemPressed = useCallback(() => {
      Alert.alert(item.title);
    }, []);

    return (
      <TouchableOpacity onPress={itemPressed} style={styles.item}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text $dark>{item.startHour}</Text>
          <Text $size="s" style={styles.itemDurationText}>
            {item.duration}
          </Text>
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

  const renderItem = useCallback((item: AgendaItem) => {
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
