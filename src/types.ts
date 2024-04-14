type UserType = {
  id: string;
  mail: string;
  role: Role;
};

type Role = "admin" | "office" | "student";

type EtuType = UserType & {
  lastName: string;
  firstName: string;
  // ...
};
type OfficeType = UserType & {
  acronym: string;
  name: string;
  description: string;
  logo: string;
  members: Array<string>;
  clubs: Array<string>;
  // ...
};
type AdminType = UserType & {
  name: string;
};

// Posts
type Post = {
  id: string;
  title: string;
  description: string;
  editor: string;
  image: string;
  tags: Array<string>;
  createdAt: number;
  visibleCal: boolean;
  date: {
    startDay?: string;
    startHour?: string;
    endDay?: string;
    endHour?: string;
  };
};

// Form
type FormFieldProps<T> = {
  name: keyof T;
  required: boolean;
  confirm?: boolean;
}[];
