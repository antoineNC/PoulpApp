import { Timestamp } from "firebase/firestore";
import moment from "moment";
import "moment/locale/fr";
import { capitalize } from "utils/utils";
moment.locale("fr");

/**
 * @returns Returns a formatted date like "Dim. 25 avr. 2024 à 9:01"
 */
export const formatAllDate = (date: moment.MomentInput) => {
  return capitalize(moment(date).format("ddd D MMM YYYY [à] H:mm"));
};
/**
 * @returns Returns a formatted date like "Dim. 25 avr. 2024"
 */
export const formatDay = (date: moment.MomentInput) => {
  return capitalize(moment(date).format("ddd D MMM YYYY"));
};
/**
 * @returns Returns a formatted time like "09:01"
 */
export const formatHour = (date: moment.MomentInput) => {
  return capitalize(moment(date).format("HH:mm"));
};
/**
 * @returns Returns a formatted date like "1987-03-05"
 */
export const formatDate = (date: moment.MomentInput) => {
  return capitalize(moment(date).format("YYYY-MM-DD"));
};
/**
 * Specific function for formatted date like "ddd D MMM YYYY [à] H:mm"
 * @param startDate
 * @param endDate
 * @returns Returns difference between start and end in hours and minutes
 * @example const duration = getDuration("Dim. 28 avr. 2024 à 18:00", "Dim. 28 avr. 2024 à 19:30")
 * console.log(duration) // 1h30
 *
 * const duration = getDuration("Dim. 28 avr. 2024 à 18:00", "Dim. 28 avr. 2024 à 20:00")
 * console.log(duration) // 2h
 */
export const getDuration = (
  startDate: moment.MomentInput,
  endDate: moment.MomentInput
) => {
  const start = moment(startDate, "ddd D MMM YYYY [à] H:mm");
  const end = moment(endDate, "ddd D MMM YYYY [à] H:mm");
  const duration = end.diff(start, "minutes");
  const h = (duration / 60) | 0;
  const m = duration % 60 | 0;

  return `${h}h${m || ""}`;
};

/**
 *
 * @param date A date with Timestamps start and end
 * @returns If start and end have the same day an same time with seconds precision, returns allday : true and date with "ddd D MMM YYYY" format. Else, returns allday, : false and date with "ddd D MMM YYYY [à] H:mm" format.
 */
export const displayDateFromTimestamp = (date: {
  end: Timestamp;
  start: Timestamp;
}) => {
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

export const displayDateFromDate = (date: { end: Date; start: Date }) => {
  const startDate = date.start.toUTCString();
  const endDate = date.end.toUTCString();
  if (startDate === endDate) {
    const day = formatDay(startDate);
    return { allday: true, date: { start: day, end: day } };
  } else {
    const start = formatAllDate(startDate);
    const end = formatAllDate(endDate);
    return { allday: false, date: { start, end } };
  }
};

export const formattedToday = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const HH = today.getHours();
  const MM = today.getMinutes();
  const ss = today.getSeconds();
  return `${yyyy}${mm}${dd}_${HH}${MM}${ss}_`;
};
