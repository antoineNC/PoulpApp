import { createEffect, createEvent, createStore } from "effector";

import { login, updateMail } from "firebase/firebaseUtils";

// ======= STUDENT
const actionStudent = {
  login: createEvent<EtuType>("LOGIN"),
  logout: createEvent("LOGOUT"),
  restore: createEvent<EtuType>("RESTORE"),
  updateMail: createEffect(updateMail),
};

const defaultStudent: EtuType = {
  id: "",
  role: "student",
  mail: "",
  lastName: "",
  firstName: "",
};

const $studentStore = createStore(defaultStudent)
  .on(actionStudent.login, (_, user) => ({
    id: user.id,
    role: "student",
    mail: user.mail,
    lastName: user.lastName,
    firstName: user.firstName,
  }))
  .on(actionStudent.updateMail.doneData, (state, mail) => ({ ...state, mail }))
  .on(actionStudent.restore, (_, value) => value)
  .reset(actionStudent.logout);

// ======= OFFICE
const actionOffice = {
  login: createEvent<OfficeType>("LOGIN"),
  logout: createEvent("LOGOUT"),
  restore: createEvent<OfficeType>("RESTORE"),
  updateMail: createEffect(updateMail),
};

const defaultOffice: OfficeType = {
  id: "",
  role: "office",
  mail: "",
  name: "",
  clubs: [""],
};

const $officeStore = createStore(defaultOffice)
  .on(actionOffice.login, (_, user) => ({
    id: user.id,
    role: "office",
    mail: user.mail,
    name: user.name,
    clubs: user.clubs,
  }))
  .on(actionOffice.updateMail.doneData, (state, mail) => ({ ...state, mail }))
  .on(actionOffice.restore, (_, value) => value)
  .reset(actionOffice.logout);

// ======= ADMIN
const actionAdmin = {
  login: createEvent<AdminType>("LOGIN"),
  logout: createEvent("LOGOUT"),
  restore: createEvent<AdminType>("RESTORE"),
  updateMail: createEffect(updateMail),
};

const defaultAdmin: AdminType = {
  id: "",
  role: "office",
  mail: "",
  name: "",
};

const $adminStore = createStore(defaultAdmin)
  .on(actionAdmin.login, (_, user) => ({
    id: user.id,
    role: "office",
    mail: user.mail,
    name: user.name,
  }))
  .on(actionAdmin.updateMail.doneData, (state, mail) => ({ ...state, mail }))
  .on(actionAdmin.restore, (_, value) => value)
  .reset(actionAdmin.logout);

export {
  $studentStore,
  actionStudent,
  $officeStore,
  actionOffice,
  $adminStore,
  actionAdmin,
};
