export type DateType = {
  start: string;
  end: string;
};

export type DatePickerValues = {
  showStart?: boolean;
  showEnd?: boolean;
  mode: "date" | "time";
};
