import { User } from "firebase/auth";

import { getUserRole } from "firebase/firebaseUtils";
import { actionSession } from "store/sessionStore";
import { actionAdmin } from "store/users/adminStore";
import { actionOffice } from "store/users/officeStore";
import { actionStudent } from "store/users/studentStore";

export const setUser = async (user: User) => {
  try {
    const userData = await getUserRole(user.uid);
    const userRole: Role = userData.role;
    switch (userRole) {
      case "admin":
        actionStudent.restore(userData as EtuType);
        break;
      case "office":
        actionOffice.restore(userData as OfficeType);
        break;
      case "student":
        actionAdmin.restore(userData as AdminType);
        break;
    }
    actionSession.login;
  } catch (e: any) {}
};

export const logoutStores = () => {
  actionSession.logout;
  actionStudent.logout;
  actionOffice.logout;
  actionAdmin.logout;
};
