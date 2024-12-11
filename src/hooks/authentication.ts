import { useCallback, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { signoutUser, subscribeUserState } from "firebase/service/auth.service";
import { getCurrentUser } from "firebase/service/user.service";
import { actionSession } from "@context/sessionStore";

export function useAuthState(initialState: boolean) {
  const [done, setDone] = useState(initialState);
  const handleAuth = useCallback(async (userAuth: User | null) => {
    try {
      if (userAuth) {
        const { role, userId } = await getCurrentUser(userAuth.uid);
        actionSession.login({ role, userId });
      } else {
        await signoutUser();
        actionSession.logout();
      }
      setDone(true);
    } catch (e: any) {
      throw new Error(e);
    }
  }, []);

  useEffect(() => {
    subscribeUserState(handleAuth);
    return () => {
      subscribeUserState(handleAuth);
    };
  }, [handleAuth]);
  return done;
}
