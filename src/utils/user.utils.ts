import { User } from "firebase/auth";

import { getUserData, login, signout, signup } from "@firebase";
import { actionSession } from "@context/sessionStore";
import { actionAdmin, actionOffice, actionStudent } from "@context/userStore";
import { AdminType, EtuType, OfficeType, Role } from "@types";

export const loginUser = async (props: { email: string; password: string }) => {
  try {
    const userData = await login(props);
    const userRole: Role = userData.role;
    switch (userRole) {
      case "admin":
        actionAdmin.login(userData as AdminType);
        break;
      case "office":
        actionOffice.login(userData as OfficeType);
        break;
      case "student":
        actionStudent.login(userData as EtuType);
        break;
    }
    actionSession.login();
  } catch (e: any) {
    throw Error(e);
  }
};

export const signupUser = async (props: {
  firstname: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  try {
    const userData = await signup(props);
    const userRole: Role = userData.role;
    switch (userRole) {
      case "admin":
        actionAdmin.login(userData as AdminType);
        break;
      case "office":
        actionOffice.login(userData as OfficeType);
        break;
      case "student":
        actionStudent.login(userData as EtuType);
        break;
    }
    actionSession.login();
  } catch (e: any) {
    throw Error(e);
  }
};

export const setUser = async (userAuth: User) => {
  try {
    const userData = await getUserData(userAuth.uid);
    const userRole: Role = userData.role;
    const user = { id: userAuth.uid, ...userData };
    switch (userRole) {
      case "admin":
        actionAdmin.restore(user as AdminType);
        break;
      case "office":
        actionOffice.restore(user as OfficeType);
        break;
      case "student":
        actionStudent.restore(user as EtuType);
        break;
    }
    actionSession.login();
  } catch (e: any) {
    throw Error(e);
  }
};

export const logoutUser = () => {
  actionSession.logout();
  actionStudent.logout();
  actionOffice.logout();
  actionAdmin.logout();
  signout();
};
