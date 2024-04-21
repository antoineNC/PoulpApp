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
  createdAt: string;
  visibleCal: boolean;
  date: {
    startDay?: string;
    startHour?: string;
    endDay?: string;
    endHour?: string;
  };
};

// Navigation
type TabParamList = {
  homeContainer: undefined;
  officeContainer: undefined;
  famCupContainer: undefined;
  menuContainer: undefined;
};
type AuthParamList = {
  login: undefined;
  signup: undefined;
};
type HomeParamList = {
  home: undefined;
  calendar: undefined;
};

// Form
type FormFieldProps<T> = {
  name: keyof T;
  required: boolean;
  confirm?: boolean;
}[];
