import { createEvent, createStore } from "effector";
import { Role, SessionType } from "types/session.type";
import { Student } from "types/student.type";

export const actionSession = {
  login: createEvent<{ userId: string; role: Role }>("LOGIN"),
  setStudent: createEvent<Student>("SET STUDENT USER"),
  logout: createEvent("LOGOUT"),
};

const defaultSession: SessionType = {
  userId: "",
  role: "STUDENT",
  connected: false,
};

export const $sessionStore = createStore<SessionType>(defaultSession)
  .on(actionSession.login, (_, { userId, role }) => ({
    userId,
    role,
    connected: true,
  }))
  .on(actionSession.setStudent, (state, payload) => ({
    ...state,
    student: payload,
  }))
  .reset(actionSession.logout);
