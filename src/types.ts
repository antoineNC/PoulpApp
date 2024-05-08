type Role = "STUDENT_ROLE" | "OFFICE_ROLE" | "ADMIN_ROLE";
type UserType = {
  id: string;
  mail: string;
};
type Student = UserType & {
  lastName: string;
  firstName: string;
  adhesion: Array<Office>;
};
type Office = UserType & {
  acronym: string;
  name: string;
  description: string;
  logo?: string;
  members: Array<string>;
  partnerships: Array<string>;
  clubs: Array<string>;
};
type Admin = UserType & {
  name: string;
};

type SessionType = {
  user: UserType;
  role: Role;
  connected: boolean;
};

// Posts
type Post = {
  id: string;
  title: string;
  description: string;
  editor: Office;
  image?: string;
  tags: Array<string>;
  createdAt: Date;
  visibleCal: boolean;
  date: {
    start?: Date;
    end?: Date;
  };
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
