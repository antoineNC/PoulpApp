import { Role } from "@types";

export type Office = {
  id: string;
  mail: string;
  name: string;
  acronym: string;
  description?: string;
  logoUrl?: string;
  members?: {
    idStudent: string;
    idRole: string;
  }[];
};

export type FirestoreOffice = {
  name: string;
  mail: string;
  acronym: string;
  role: Role;
  description?: string;
  logoId?: string;
  members?: {
    idStudent: string;
    idRole: string;
  }[];
};

export type UpdateOfficeFields = {
  name?: string;
  mail?: string;
  acronym?: string;
  description?: string;
  logoId?: string;
  members?: {
    idStudent: string;
    idRole: string;
  }[];
};

export type OfficeFormFields = {
  mail: string;
  name: string;
  acronym: string;
  description?: string;
  logoFile?: string;
  members?: {
    idStudent: string;
    idRole: string;
  }[];
};

export type RoleOffice = {
  id: string;
  name: string;
};
