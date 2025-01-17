import { actionCalendar } from "@context/calendarStore";
import { actionOffice } from "@context/officeStore";
import { actionPoint } from "@context/pointStore";
import { actionPost } from "@context/postStore";
import { actionSession } from "@context/sessionStore";
import { actionStudent } from "@context/studentStore";

export function resetAllStores() {
  actionCalendar.logout();
  actionSession.logout();
  actionStudent.logout();
  actionOffice.logout();
  actionPoint.logout();
  actionPost.logout();
}
