export type AgendaItemType = {
  title: string;
  startHour: string;
  description?: string;
  duration?: string;
};

export type CalendarSection = {
  title: string; // date yyyy-MM-dd
  data: AgendaItemType[];
};
