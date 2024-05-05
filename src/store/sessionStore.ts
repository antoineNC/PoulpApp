import { createEvent, createStore } from "effector";

export const actionSession = {
  login: createEvent<UserType>("LOGIN"),
  logout: createEvent("LOGOUT"),
};

const defaultSession: SessionType = {
  user: { id: "", mail: "", role: Role.STUDENT_ROLE },
  connected: false,
};

export const $sessionStore = createStore<SessionType>(defaultSession)
  .on(actionSession.login, (state, user) => ({
    user,
    connected: true,
  }))
  .reset(actionSession.logout);
