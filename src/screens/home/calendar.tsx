import { CalendarProps } from "@navigation/navigationTypes";
import CalendarDisplay from "components/calendarDisplay";

export default function CalendarScreen({ route }: CalendarProps) {
  return <CalendarDisplay postDate={route.params.postDate} />;
}
