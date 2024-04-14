import { createEffect, createEvent, createStore } from "effector";

import { updateMail } from "firebase/firebase.utils";

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
  .on(actionStudent.login, (_, user) => ({ ...user, role: "student" }))
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
  acronym: "",
  description: "",
  logo: "",
  mail: "",
  name: "",
  members: [""],
  clubs: [""],
};

const $officeStore = createStore(defaultOffice)
  .on(actionOffice.login, (_, user) => ({ ...user, role: "office" }))
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
  .on(actionAdmin.login, (_, user) => ({ ...user, role: "admin" }))
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
