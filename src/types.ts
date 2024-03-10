type SessionType = {
  connected: boolean;
  token?: string;
  user?: UserType;
};
type SessionActionType = {
  type: "RESTORE_TOKEN" | "SIGN_IN" | "SIGN_OUT";
  session: { user?: UserType; token?: string };
};

type UserType = {
  id: string;
  mail: string;
  access: "ALL" | "OFFICE" | "RESTRICTED";
  infos: EtuType | OfficeType | AdminType;
};

type EtuType = {
  lastName: string;
  firstName: string;
  // ...
};
type OfficeType = {
  name: string;
  clubs: string;
  // ...
};
type AdminType = {
  name: string;
};
