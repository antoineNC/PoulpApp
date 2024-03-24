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
  name: string;
  clubs: Array<string>;
  // ...
};
type AdminType = UserType & {
  name: string;
};

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
