type Role = "STUDENT_ROLE" | "OFFICE_ROLE" | "ADMIN_ROLE";
type UserType = {
  id: string;
  mail: string;
};
type Student = UserType & {
  lastName: string;
  firstName: string;
  adhesion?: string[];
  memberOf?: string[];
};
type Office = UserType & {
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
  createdAt: number;
  editorId: string;
  description?: string;
  imageUrl?: string;
  tags?: Array<string>;
  date?: {
    start: number;
    end: number;
  };
  editor?: Office;
};

type Club = {
  id: string;
  name: string;
  officeId: string;
  description?: string;
  contact?: string;
  logoUrl?: string;
};

type Partnership = {
  id: string;
  name: string;
  officeId: string;
  description?: string;
  address?: string;
  addressMap?: string;
  benefits?: string[];
  logoUrl?: string;
};

type RoleOffice = {
  id: string;
  name: string;
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
