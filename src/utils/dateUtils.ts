import { format, intervalToDuration, isBefore } from "date-fns";
import { fr } from "date-fns/locale";
import { capitalize } from "utils/utils";

/**
 * @returns Returns a formatted date like "Dim. 25 avr. 2024 à 9:01"
 */
export const formatDayTime = (date: Date) => {
  return capitalize(format(date, "E d MMM yyyy 'à' H:mm", { locale: fr }));
};
/**
 * @returns Returns a formatted date like "Dim. 25 avr. 2024"
 */
export const formatDay = (date: Date) => {
  return capitalize(format(date, "E d MMM yyyy", { locale: fr }));
};
/**
 * @returns Returns a formatted time like "09:01"
 */
export const formatHour = (date: Date) => {
  return format(date, "HH:mm", { locale: fr });
};
/**
 * @returns Returns a formatted date like "1987-03-05"
 */
export const formatDate = (date: Date) => {
  return capitalize(format(date, "yyyy-MM-dd", { locale: fr }));
};
/**
 * Display difference between two dates, in hours and minutes, or in days
 * @param startDate
 * @param endDate
 * @returns Returns difference between start and end in hours and minutes, or in days if more than 24 hours
 * @example const duration = getDuration("Dim. 28 avr. 2024 à 18:00", "Dim. 28 avr. 2024 à 19:30")
 * console.log(duration) // 1h30
 *
 * const duration = getDuration("Dim. 28 avr. 2024 à 18:00", "Dim. 28 avr. 2024 à 20:00")
 * console.log(duration) // 2h
 */
export const getDuration = (startDate: Date, endDate?: Date) => {
  if (endDate) {
    const duration = intervalToDuration({ start: startDate, end: endDate });
    if (duration.days) {
      return `${duration.days} jour${duration.days > 1 && "s"}`;
    } else return `${duration.hours || 0}h${duration.minutes || ""}`;
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

export const getCurrentScholarYear = () => {
  const today = new Date();
  const todayYear = today.getFullYear();
  // si on est avant le 1er août (pré rentrée), la rentrée était l'année dernière, sinon c'est cette année
  const startYear = isBefore(today, new Date(todayYear, 7, 1))
    ? todayYear - 1
    : todayYear;
  const endYear = startYear + 1;
  // rentrée = 1er aout année n , fin d'année = 31 juillet année n+1
  const startDate = new Date(startYear, 7, 1);
  const endDate = new Date(endYear, 6, 31);
  return { startDate, endDate };
};
