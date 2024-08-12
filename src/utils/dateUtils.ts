import moment from "moment";
import "moment/locale/fr";
moment.locale("fr");

export const formatAllDate = (date: number | Date | string) => {
  return moment(date).format("ddd D MMMM YYYY [à] H:mm");
};
export const formatDay = (date: number | Date | string) => {
  return moment(date).format("ddd D MMM YYYY");
};

export const displayDate = (date: Post["date"]) => {
  if (date) {
    const startDate = new Date(date.start).toUTCString();
    const endDate = new Date(date.end).toUTCString();
    if (startDate === endDate) {
      const day = formatDay(startDate);
      return { allday: true, date: { start: day, end: day } };
    } else {
      const start = formatAllDate(startDate);
      const end = formatAllDate(endDate);
      return { allday: false, date: { start, end } };
    }
  }
};
