import { CalendarProps } from "@navigation/navigationTypes";
import CalendarDisplay from "components/calendarDisplay";

export default function CalendarScreen({ route }: CalendarProps) {
  const date = route.params.postDate;
  const postDate = date ? new Date(date) : new Date();
  return <CalendarDisplay postDate={postDate} />;
}
