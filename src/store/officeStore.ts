import { getAllOffice } from "@firebase";
import { OfficeType } from "@types";
import { createEffect, createEvent, createStore } from "effector";

const actionOffice = {
  setOffices: createEffect(async () => {
    return await getAllOffice();
  }),
  logout: createEvent("LOGOUT"),
};

const defaultStudent: OfficeType[] = [
  {
    id: "",
    role: "office",
    mail: "",
    name: "",
    acronym: "",
    description: "",
    logo: "",
    clubs: [],
    members: [],
  },
];

const $officesStore = createStore(defaultStudent)
  .on(actionOffice.setOffices.doneData, (_, offices) => offices)
  .reset(actionOffice.logout);

export { actionOffice, $officesStore };
