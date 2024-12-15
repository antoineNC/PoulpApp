import moment from "moment";
import "moment/locale/fr";
import { capitalize } from "utils/utils";
moment.locale("fr");

/**
 * @returns Returns a formatted date like "Dim. 25 avr. 2024 à 9:01"
 */
export const formatDayTime = (date: moment.MomentInput) => {
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

export const displayDate = (date: { start: Date; end?: Date }) => {
  if (date.end) {
    const startDate = formatDayTime(date.start);
    const endDate = formatDayTime(date.end);
    return { startDate, endDate };
  } else {
    const startDate = formatDay(date.start);
    return { startDate };
  }
};
