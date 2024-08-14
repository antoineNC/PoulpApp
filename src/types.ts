import { Timestamp } from "firebase/firestore";
import { KeyboardTypeOptions } from "react-native";

export type Role = "STUDENT_ROLE" | "OFFICE_ROLE" | "ADMIN_ROLE";
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
  description: string;
  logoUrl: string;
  members?: {
    idStudent: string;
    idRole: string;
  }[];
  partnerships?: string[];
  clubs?: string[];
};
export type Admin = UserType & {
  name: string;
};

export type SessionType = {
  user: UserType;
  role: Role;
  connected: boolean;
};

export type Post = {
  id: string;
  title: string;
  createdAt: Timestamp;
  editorId: string;
  description?: string;
  imageUrl?: string;
  tags?: Array<string>;
  date?: {
    start: Timestamp;
    end: Timestamp;
  };
  editor?: Office;
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
  titre: string;
  date: Timestamp;
  bleu: number;
  jaune: number;
  orange: number;
  rouge: number;
  vert: number;
};

export type FormFieldProps<T> = {
  name: keyof T;
  label?: string;
  type?: string;
  props: {
    multiline?: boolean;
    keyboardType?: KeyboardTypeOptions;
  };
  required: boolean;
  confirm?: boolean;
}[];

export type DateType = {
  start: string;
  end: string;
};
