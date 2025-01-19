import { createEvent, createStore } from "effector";
import { MarkedDates } from "react-native-calendars/src/types";
import { CalendarSection } from "types/calendar.type";

type CalendarStoreType = {
  sections: CalendarSection[];
  markedDates: MarkedDates;
};

const actionCalendar = {
  setItems: createEvent<CalendarStoreType>("SET_CALENDAR_ITEMS"),
  logout: createEvent("LOGOUT"),
};

const defaultItems: CalendarStoreType = {
  sections: [],
  markedDates: {},
};

const $calendarStore = createStore(defaultItems)
  .on(actionCalendar.setItems, (_, payload) => ({
    ...payload,
  }))
  .reset(actionCalendar.logout);

export { $calendarStore, actionCalendar };
