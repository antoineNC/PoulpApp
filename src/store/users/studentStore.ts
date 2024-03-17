import { createEffect, createEvent, createStore } from "effector";

import { login, updateMail } from "firebase/firebaseUtils";

const actionStudent = {
  login: createEffect(
    async (credentials: { email: string; password: string }) => {
      return (await login(credentials)) as EtuType;
    }
  ),
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
  .on(actionStudent.login.doneData, (_, user) => ({
    id: user.id,
    role: "student",
    mail: user.mail,
    lastName: user.lastName,
    firstName: user.firstName,
  }))
  .on(actionStudent.updateMail.doneData, (state, mail) => ({ ...state, mail }))
  .on(actionStudent.restore, (_, value) => value)
  .reset(actionStudent.logout);

export { $studentStore, actionStudent };
