import { Timestamp } from "firebase/firestore";
import moment from "moment";
import "moment/locale/fr";
import { capitalize } from "utils/utils";
moment.locale("fr");

export const formatAllDate = (date: moment.MomentInput) => {
  return capitalize(moment(date).format("ddd D MMMM YYYY [à] H:mm"));
};
export const formatDay = (date: moment.MomentInput) => {
  return capitalize(moment(date).format("ddd D MMM YYYY"));
};

export const displayDate = (date: { end: Timestamp; start: Timestamp }) => {
  const startDate = date.start.toDate().toUTCString();
  const endDate = date.end.toDate().toUTCString();
  if (startDate === endDate) {
    const day = formatDay(startDate);
    return { allday: true, date: { start: day, end: day } };
  } else {
    const start = formatAllDate(startDate);
    const end = formatAllDate(endDate);
    return { allday: false, date: { start, end } };
  }
};
