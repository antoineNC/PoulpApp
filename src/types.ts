enum Role {
  ADMIN_ROLE = "ADMIN",
  STUDENT_ROLE = "STUDENT",
  OFFICE_ROLE = "OFFICE",
}
type UserType = {
  id: string;
  mail: string;
  role: Role;
};
type StudentType = UserType & {
  lastName: string;
  firstName: string;
  adhesion: Array<OfficeType>;
};
type OfficeType = UserType & {
  acronym: string;
  name: string;
  description: string;
  logo: string;
  members: Array<StudentType>;
  partnerships: Array<string>;
  clubs: Array<string>;
};
type AdminType = UserType & {
  name: string;
};

type SessionType = {
  user: UserType;
  connected: boolean;
};

// Posts
type Post = {
  id: string;
  editorLogo: string;
};

// Clubs
type Club = {
  name: string;
  description: string;
  contact: string;
  logo: string;
  office: string;
};

// Form
type FormFieldProps<T> = {
  name: keyof T;
  required: boolean;
  confirm?: boolean;
}[];
