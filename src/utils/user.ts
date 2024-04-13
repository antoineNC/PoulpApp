import { User } from "firebase/auth";

import { getUserData, login, signout, signup } from "firebase/firebaseUtils";
import { actionSession } from "store/sessionStore";
import { actionAdmin, actionOffice, actionStudent } from "store/userStore";

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
  } catch (e: any) {
    throw Error(e);
  }
};

export const setUser = async (user: User) => {
  try {
    const userData = await getUserData(user.uid);
    const userRole: Role = userData.role;
    switch (userRole) {
      case "admin":
        actionAdmin.restore(userData as AdminType);
        break;
      case "office":
        actionOffice.restore(userData as OfficeType);
        break;
      case "student":
        actionStudent.restore(userData as EtuType);
        break;
    }
    actionSession.login;
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
