import { useEffect } from "react";
import { actionCalendar } from "@context/calendarStore";
import { getCalendarItems } from "@fb/service/post.service";

export function useCalendar() {
  useEffect(() => {
    (async function () {
      const { sections, markedDates } = await getCalendarItems();
      actionCalendar.setItems({ sections, markedDates });
    })();
  }, []);
}
