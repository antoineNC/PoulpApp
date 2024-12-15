import { actionCalendar } from "@context/calendar.store";
import { getCalendarItems } from "@fb/service/post.service";
import { useEffect } from "react";

export function useCalendar() {
  useEffect(() => {
    (async function () {
      const { sections, markedDates } = await getCalendarItems();
      actionCalendar.setItems({ sections, markedDates });
    })();
  }, []);
}
