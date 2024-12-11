import { Timestamp } from "firebase/firestore";
import { InputModeOptions } from "react-native";
import { Office } from "types/office.type";

const Roles = ["STUDENT", "BDE", "BDA", "BDS", "I2C", "BDF", "ADMIN"] as const;
export type Role = (typeof Roles)[number];
export type UserType = {
  id: string;
  mail: string;
};
export type Student = UserType & {
  lastName: string;
  firstName: string;
  adhesion?: string[];
  memberOf?: string[];
};

export type Admin = UserType & {
  name: string;
};

export type SessionType = {
  userId: string;
  role: Role;
  connected: boolean;
  student?: Student;
  office?: Office;
  admin?: Admin;
};

export type Point = {
  id: string;
  title: string;
  date: Timestamp;
  blue: number;
  yellow: number;
  orange: number;
  red: number;
  green: number;
};

export type PointsFieldNames = {
  title: string;
  date: Timestamp;
  blue: number;
  yellow: number;
  orange: number;
  red: number;
  green: number;
};

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

export type DateType = {
  start: string;
  end: string;
};

export type DatePickerValues = {
  showStart?: boolean;
  showEnd?: boolean;
  mode: "date" | "time";
};
