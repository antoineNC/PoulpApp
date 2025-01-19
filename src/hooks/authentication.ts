import { useCallback, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { subscribeUserState } from "@fb/service/auth.service";
import { getCurrentUser } from "@fb/service/user.service";
import { actionSession } from "@context/sessionStore";
import { getErrorMessage, signOutAndResetStores } from "utils/errorUtils";
import { notificationToast } from "utils/toast";

export function useAuthState(initialState: boolean) {
  const [done, setDone] = useState(initialState);
  const handleAuth = useCallback(async (userAuth: User | null) => {
    try {
      if (userAuth) {
        const sessionCredential = await getCurrentUser(userAuth.uid);
        actionSession.login(sessionCredential);
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      notificationToast("error", `Erreur lors de la reconnexion. ${msg}`);
      await signOutAndResetStores();
    } finally {
      setDone(true);
    }
  }, []);

  useEffect(() => {
    const unsub = subscribeUserState(handleAuth);
    return () => unsub();
  }, [handleAuth]);
  return done;
}
