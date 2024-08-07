import { createEvent, createStore } from "effector";

export const actionSession = {
  login: createEvent<{ user: UserType; role: Role }>("LOGIN"),
  logout: createEvent("LOGOUT"),
};

const defaultSession: SessionType = {
  user: { id: "", mail: "" },
  role: "STUDENT_ROLE",
  connected: false,
};

export const $sessionStore = createStore<SessionType>(defaultSession)
  .on(actionSession.login, (_, { user, role }) => ({
    user,
    role,
    connected: true,
  }))
  .reset(actionSession.logout);
