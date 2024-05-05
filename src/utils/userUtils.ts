import { User } from "firebase/auth";

import { getUser, login, signout, signup } from "@firebase";
import { actionSession } from "@context/sessionStore";
import { AdminType, EtuType, OfficeType, Role } from "@types";

const loginUser = async (props: { email: string; password: string }) => {
  try {
    const userId = await login(props);
    await setCurrentUser(userId);
  } catch (e: any) {
    throw Error(e);
  }
};

const signupUser = async (props: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  try {
    const userId = await signup(props);
    await setCurrentUser(userId);
  } catch (e: any) {
    throw Error(e);
  }
};

const setCurrentUser = async (id: string) => {
  try {
    const user = await getUser(userAuth.uid);
    actionSession.login(user);
  } catch (e: any) {
    throw Error(e);
  }
};

const logoutUser = () => {
  actionSession.logout();
  signout();
};

export { loginUser, signupUser, setCurrentUser, logoutUser };
