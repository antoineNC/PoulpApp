import { Timestamp } from "firebase/firestore";
import { InputModeOptions } from "react-native";

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
export type Office = UserType & {
  acronym: string;
  name: string;
  description?: string;
  logoUrl?: string;
  members?: {
    idStudent: string;
    idRole: string;
  }[];
};
export type Admin = UserType & {
  name: string;
};

export type SessionType = {
  user: UserType;
  role: Role;
  connected: boolean;
  student?: Student;
  office?: Office;
  admin?: Admin;
};

export type Post = {
  id: string;
  title: string;
  createdAt: Timestamp;
  editorId: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  date?: {
    start: Timestamp;
    end: Timestamp;
  };
};

export type Club = {
  id: string;
  name: string;
  officeId: string;
  description?: string;
  contact?: string;
  logoUrl?: string;
};

export type Partnership = {
  id: string;
  name: string;
  officeId: string;
  description?: string;
  address?: string;
  addressMap?: string;
  benefits?: string[];
  logoUrl?: string;
};

export type RoleOffice = {
  id: string;
  name: string;
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

export type PostFieldNames = {
  title: string;
  description?: string;
  date?: { start: Timestamp; end: Timestamp };
  tags: string[];
  editor: { value: string; label: string };
  imageFile?: string;
};

export type fb_Post = {
  title: string;
  createdAt: Timestamp;
  editorId: string;
  description?: string;
  imageId?: string;
  tags?: string[];
  date?: {
    start: Timestamp;
    end: Timestamp;
  };
};

export type OfficeFieldNames = {
  acronym: string;
  name: string;
  mail: string;
  description?: string;
  logoFile?: string;
  members?: {
    idStudent: string;
    idRole: string;
  }[];
};

export type fb_Office = {
  acronym: string;
  name: string;
  mail: string;
  description?: string;
  logoId?: string;
  members?: {
    idStudent: string;
    idRole: string;
  }[];
};

export type ClubFieldNames = {
  name: string;
  office: { value: string; label: string };
  description?: string;
  contact?: string;
  logoFile?: string;
};

export type fb_Club = {
  name: string;
  officeId: string;
  description?: string;
  contact?: string;
  logoId?: string;
};

export type PartnershipFieldNames = {
  name: string;
  office: { value: string; label: string };
  description?: string;
  address?: string;
  addressMap?: string;
  benefits?: { value: string }[];
  logoFile?: string;
};

export type fb_Partnership = {
  name: string;
  officeId: string;
  description?: string;
  address?: string;
  addressMap?: string;
  benefits?: string[];
  logoId?: string;
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
