import { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { Card, Text } from "react-native-paper";
import { Agenda, AgendaSchedule } from "react-native-calendars";
import { useUnit } from "effector-react";

import { colors } from "@theme";
import { $postStore } from "@context/postStore";
import { $officeStore } from "@context/officeStore";
import { ensc_logo_url } from "data";

export default function CalendarScreen() {
  const posts = useUnit($postStore);
  const { officeList } = useUnit($officeStore);
  const [events, setEvents] = useState<AgendaSchedule>({});

  const postToCalendarEvent = (
    events: AgendaSchedule,
    post: Post
  ): AgendaSchedule => {
    // formatted from 28/03/2024 to 2024-03-28
    if (post.date?.start) {
      const editor = officeList.find((el) => el.id === post.editor);
      const date = post.date.start;
      const dateFormatted = date.toISOString().split("T")[0];
      const info = {
        title: post.title,
        editor: editor?.logo || ensc_logo_url,
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
    const eventPosts = posts.filter((el) => el.visibleCal);
    const events = eventPosts.reduce(postToCalendarEvent, {});
    setEvents(events);
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
