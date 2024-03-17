import { createEffect, createEvent, createStore } from "effector";

import { login, updateMail } from "firebase/firebaseUtils";

const actionAdmin = {
  login: createEffect(
    async (credentials: { email: string; password: string }) => {
      return (await login(credentials)) as AdminType;
    }
  ),
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
  .on(actionAdmin.login.doneData, (_, user) => ({
    id: user.id,
    role: "office",
    mail: user.mail,
    name: user.name,
  }))
  .on(actionAdmin.updateMail.doneData, (state, mail) => ({ ...state, mail }))
  .on(actionAdmin.restore, (_, value) => value)
  .reset(actionAdmin.logout);

export { $adminStore, actionAdmin };
