import { createEvent, createStore } from "effector";

export const actionSession = {
  login: createEvent("LOGIN"),
  logout: createEvent("LOGOUT"),
};

const defaultSession: boolean = false;

export const $sessionStore = createStore<boolean>(defaultSession)
  .on(actionSession.login, (_, __) => true)
  .reset(actionSession.logout);
