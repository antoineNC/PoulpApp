import { InputModeOptions } from "react-native";

export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "image"
  | "date"
  | "chip"
  | "select"
  | "double-select";

export type FormFieldOptions = {
  multiline?: boolean; // text
  inputMode?: InputModeOptions; // text
  secureText?: boolean; // text
  autoCap?: "none" | "sentences" | "words" | "characters";
  confirm?: boolean; // text
  rules?: string[]; // text, date
  allDay?: boolean; // date
  choices?: { value: string; label: string }[];
  add?: boolean; // text, select, double-select
};

export type FormFieldValues<T> = {
  name: keyof T;
  label: string;
  type: FormFieldType;
  required?: boolean;
  options?: FormFieldOptions;
}[];
