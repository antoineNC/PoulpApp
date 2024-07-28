type Role = "STUDENT_ROLE" | "OFFICE_ROLE" | "ADMIN_ROLE";
type UserType = {
  id: string;
  mail: string;
};
type Student = UserType & {
  lastName: string;
  firstName: string;
  adhesion?: string[];
};
type Office = UserType & {
  acronym: string;
  name: string;
  description: string;
  logo: string;
  members: {
    idStudent: string;
    idRole: string;
  }[];
  partnerships?: string[];
  clubs?: string[];
};
type Admin = UserType & {
  name: string;
};

type SessionType = {
  user: UserType;
  role: Role;
  connected: boolean;
};

type Post = {
  id: string;
  title: string;
  description?: string;
  editor: string;
  image?: string;
  tags?: Array<string>;
  createdAt: Date;
  visibleCal: boolean;
  date?: {
    start: Date;
    end?: Date;
  };
};

type Club = {
  id: string;
  name: string;
  office: string;
  description?: string;
  contact?: string;
  logo?: string;
};

type Partnership = {
  id: string;
  name: string;
  office: string;
  description?: string;
  address?: string;
  addressMap?: string;
  advantages?: string[];
  logo?: string;
};

type Point = {
  id: string;
  titre: string;
  date: Date;
  bleu: number;
  jaune: number;
  orange: number;
  rouge: number;
  vert: number;
};

type FormFieldProps<T> = {
  name: keyof T;
  required: boolean;
  confirm?: boolean;
}[];
