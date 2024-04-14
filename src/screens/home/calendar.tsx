import { useUnit } from "effector-react";
import { getEventPosts } from "firebase/firebase.utils";
import { useEffect, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Agenda, AgendaSchedule } from "react-native-calendars";
import { Avatar, Card, Text } from "react-native-paper";
import { $postStore } from "store/postStore";
import { colors } from "theme";

export default function CalendarScreen() {
  const [events, setEvents] = useState<AgendaSchedule>({});
  const postToCalendarEvent = (
    events: AgendaSchedule,
    post: Post
  ): AgendaSchedule => {
    const { date } = post;
    // from 28/03/2024 to 2024-03-28
    const keyDate =
      date.startDay?.slice(6) +
      "-" +
      date.startDay?.slice(3, 5) +
      "-" +
      date.startDay?.slice(0, 2);
    if (events[keyDate] !== undefined) {
      events[keyDate].push({
        name: post.title,
        height: 0,
        day: post.description,
      });
    } else
      events[keyDate] = [
        {
          name: post.title,
          height: 0,
          day: post.description,
        },
      ];
    return events;
  };

  useEffect(() => {
    getEventPosts((posts) => {
      const events = posts.reduce(postToCalendarEvent, {});
      setEvents(events);
    });
  }, []);

  $postStore.watch((state) => console.log("POSTS", state));
  return (
    <Agenda
      // The list of items that have to be displayed in agenda. If you want to render item as empty date
      // the value of date key has to be an empty array []. If there exists no value for date key it is
      // considered that the date in question is not yet loaded
      items={events}
      // Callback that gets called when items for a certain month should be loaded (month became visible)
      loadItemsForMonth={(month) => {
        // console.log("trigger items loading");
      }}
      // Callback that fires when the calendar is opened or closed
      onCalendarToggled={(calendarOpened) => {
        // console.log(calendarOpened);
      }}
      // Callback that gets called on day press
      onDayPress={(day) => {
        // console.log("day pressed");
      }}
      // Callback that gets called when day changes while scrolling agenda list
      onDayChange={(day) => {
        // console.log("day changed");
      }}
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
              title={item.name}
              right={(props) => (
                <Image
                  source={{
                    uri: "https://firebasestorage.googleapis.com/v0/b/poulpappv2.appspot.com/o/Assets%2Fbda.png?alt=media&token=592972bb-3465-4614-ad31-d04589960417",
                  }}
                  style={{ height: 50, width: 50 }}
                />
              )}
            />
            <Card.Content>
              <Text variant="bodyMedium" numberOfLines={3}>
                {item.day}
              </Text>
            </Card.Content>
          </Card>
        );
      }}
      // Specify how each date should be rendered. day can be undefined if the item is not first in that day
      // renderDay={(day, item) => {
      //   return <View />;
      // }}
      // Specify how empty date content with no items should be rendered
      renderEmptyDate={() => {
        return <View />;
      }}
      // Override inner list with a custom implemented component
      // renderList={(listProps) => {
      //   return <MyCustomList {...listProps} />;
      // }}
      // Specify what should be rendered instead of ActivityIndicator
      renderEmptyData={() => {
        return <View />;
      }}
      // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
      showClosingKnob
      // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly
      // onRefresh={() => console.log("refreshing...")}
      // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView

      // Agenda theme
      theme={{
        agendaTodayColor: "green",
        agendaKnobColor: colors.primary,
      }}
      // Agenda container style
      style={{}}
    />
  );
}
