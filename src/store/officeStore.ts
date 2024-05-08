import { createEvent, createStore } from "effector";

const actionOffice = {
  setAllOffice: createEvent<Office[]>("SET_ALL_OFFICE"),
  logout: createEvent("LOGOUT"),
};

const defaultOfficeList: Office[] = [];

const $officeStore = createStore(defaultOfficeList)
  .on(actionOffice.setAllOffice, (_, officeList) => officeList)
  .reset(actionOffice.logout);

export { actionOffice, $officeStore };
