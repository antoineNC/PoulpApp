import { createEffect, createEvent, createStore } from "effector";

import { login, updateMail } from "firebase/firebaseUtils";

const actionOffice = {
  login: createEffect(
    async (credentials: { email: string; password: string }) => {
      return (await login(credentials)) as OfficeType;
    }
  ),
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
  .on(actionOffice.login.doneData, (_, user) => ({
    id: user.id,
    role: "office",
    mail: user.mail,
    name: user.name,
    clubs: user.clubs,
  }))
  .on(actionOffice.updateMail.doneData, (state, mail) => ({ ...state, mail }))
  .on(actionOffice.restore, (_, value) => value)
  .reset(actionOffice.logout);

export { $officeStore, actionOffice };
