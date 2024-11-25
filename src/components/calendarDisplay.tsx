import React, { useCallback, useMemo } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { useUnit } from "effector-react";
import { groupBy } from "lodash";
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
  LocaleConfig,
} from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { Timestamp } from "firebase/firestore";
import { $postStore } from "@context/postStore";
import {
  displayDateFromTimestamp,
  formatDate,
  formatHour,
  getDuration,
} from "utils/dateUtils";
import { Text } from "@styledComponents";
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

export default function CalendarDisplay({
  postDate,
}: {
  postDate?: Timestamp;
}) {
  const today = formatDate(postDate ? postDate.toDate() : new Date());
  const { posts } = useUnit($postStore);

  const { sections, markedDates } = useMemo(() => {
    const agendaItems: AgendaItem[] = [];

    // Conserve uniquement les posts avec une date et formate les données
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

    // Ordonne par date et par heure de début
    agendaItems.sort((itemA, itemB) => {
      const dateCompare = itemA.startDate.localeCompare(itemB.startDate);
      if (dateCompare === 0) {
        if (itemA.duration) {
          return itemA.startHour.localeCompare(itemB.startHour);
        } else {
          // S'il n'y a pas de durée, alors "Journée entière", donc événement "itemA" doit être placé en premier
          return -1;
        }
      } else return dateCompare;
    });

    // regroupe en un objet : la KEY est une date et la VALUE un tableau avec les posts à cette date
    const agendaItemsGroupped = groupBy(
      agendaItems,
      (item) => item.startDate
    ) as {
      [date: string]: AgendaItem[];
    };

    const sections: SectionType[] = [];
    const markedDates: MarkedDates = {};
    //
    Object.keys(agendaItemsGroupped).forEach((key) => {
      if (agendaItemsGroupped[key]) {
        sections.push({ title: key, data: agendaItemsGroupped[key] });
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
