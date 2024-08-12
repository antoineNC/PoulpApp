import moment from "moment";
import "moment/locale/fr";
moment.locale("fr");

export const formatAllDate = (date: number | Date | string) => {
  return moment(date).format("ddd D MMMM YYYY [à] H:mm");
};
export const formatDay = (date: number | Date | string) => {
  return moment(date).format("ddd D MMM YYYY");
};
