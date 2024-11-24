import { Role, SessionType, Student, UserType } from "@types";
import { createEvent, createStore } from "effector";

export const actionSession = {
  login: createEvent<{ user: UserType; role: Role }>("LOGIN"),
  setStudent: createEvent<Student>("SET STUDENT USER"),
  logout: createEvent("LOGOUT"),
};

const defaultSession: SessionType = {
  user: { id: "", mail: "" },
  role: "STUDENT",
  connected: false,
};

export const $sessionStore = createStore<SessionType>(defaultSession)
  .on(actionSession.login, (_, { user, role }) => ({
    user,
    role,
    connected: true,
  }))
  .on(actionSession.setStudent, (state, payload) => ({
    ...state,
    student: payload,
  }))
  .reset(actionSession.logout);
