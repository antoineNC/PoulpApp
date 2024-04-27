type UserType = {
  id: string;
  mail: string;
  role: Role;
};

type Role = "admin" | "office" | "student";

type EtuType = UserType & {
  lastName: string;
  firstName: string;
};
type OfficeType = UserType & {
  acronym: string;
  name: string;
  description: string;
  logo: string;
  members: Array<string>;
  clubs: Array<string>;
};
type AdminType = UserType & {
  name: string;
};

// Posts
type Post = fb_Post & {
  id: string;
  editorLogo: string;
};

// Form
type FormFieldProps<T> = {
  name: keyof T;
  required: boolean;
  confirm?: boolean;
}[];
