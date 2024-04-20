import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { getEventPosts } from "firebase/firebase.utils";
import { Agenda, AgendaSchedule } from "react-native-calendars";
import { Card, Text } from "react-native-paper";
import { colors } from "theme";
import { Post } from "types";

export default function CalendarScreen() {
  const [events, setEvents] = useState<AgendaSchedule>({});
  const postToCalendarEvent = (
    events: AgendaSchedule,
    post: Post
  ): AgendaSchedule => {
    const { date } = post;
    // formatted from 28/03/2024 to 2024-03-28
    const keyDate =
      date.startDay?.slice(6) +
      "-" +
      date.startDay?.slice(3, 5) +
      "-" +
      date.startDay?.slice(0, 2);
    const data = {
      title: post.title,
      editor: post.editorLogo,
      tags: post.tags,
      description: post.description,
    };
    if (events[keyDate] !== undefined) {
      events[keyDate].push(data);
    } else events[keyDate] = [data];
    return events;
  };

  useEffect(() => {
    getEventPosts((posts) => {
      const events = posts.reduce(postToCalendarEvent, {});
      setEvents(events);
    });
  }, []);

  return (
    <Agenda
      // The list of items that have to be displayed in agenda. If you want to render item as empty date
      // the value of date key has to be an empty array []. If there exists no value for date key it is
      // considered that the date in question is not yet loaded
      items={events}
      // Initially selected day
      selected={new Date().toISOString().slice(0, 10)}
      // Max amount of months allowed to scroll to the past. Default = 50
      pastScrollRange={50}
      // Max amount of months allowed to scroll to the future. Default = 50
      futureScrollRange={50}
      // Specify how each item should be rendered in agenda
      renderItem={(item, firstItemInDay) => {
        return (
          <Card
            mode="contained"
            style={{ marginVertical: 10, marginRight: 10 }}
            contentStyle={{ paddingRight: 15 }}
          >
            <Card.Title
              titleVariant="titleMedium"
              title={item.title}
              right={() => (
                <Image
                  source={{
                    uri: item.editor,
                  }}
                  style={{ height: 50, width: 50 }}
                />
              )}
            />
            <Card.Content>
              <Text variant="bodyMedium" numberOfLines={3}>
                {item.description}
              </Text>
            </Card.Content>
          </Card>
        );
      }}
      // Specify what should be rendered instead of ActivityIndicator
      renderEmptyData={() => {
        return <View />;
      }}
      // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
      showClosingKnob
      // Agenda theme
      theme={{
        agendaKnobColor: colors.primary,
      }}
    />
  );
}
