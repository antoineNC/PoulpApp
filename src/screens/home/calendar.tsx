import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { Card, Text } from "react-native-paper";
import { Agenda, AgendaSchedule } from "react-native-calendars";
import { getEventPosts } from "@firebase";
import { colors } from "@theme";

export default function CalendarScreen() {
  const [events, setEvents] = useState<AgendaSchedule>({});
  const postToCalendarEvent = (
    events: AgendaSchedule,
    post: Post
  ): AgendaSchedule => {
    // formatted from 28/03/2024 to 2024-03-28
    if (post.date.start) {
      const date = post.date.start.toDate();
      const dateFormatted = date.toISOString().split("T")[0];
      const info = {
        title: post.title,
        editor: post.editorLogo,
        tags: post.tags,
        description: post.description,
      };
      if (events[dateFormatted] !== undefined) {
        events[dateFormatted].push(info);
      } else events[dateFormatted] = [info];
    }

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
      items={events}
      selected={new Date().toISOString().slice(0, 10)}
      pastScrollRange={50}
      futureScrollRange={50}
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
      renderEmptyData={() => {
        return <View />;
      }}
      showClosingKnob
      theme={{
        agendaKnobColor: colors.primary,
      }}
    />
  );
}
