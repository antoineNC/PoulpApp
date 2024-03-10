import {
  createContext,
  useReducer,
  PropsWithChildren,
  Reducer,
  Dispatch,
} from "react";
import { initialSession, sessionReducer } from "@context/session/sessionStore";

export const SessionContext = createContext<{
  session: SessionType;
  setSession: Dispatch<SessionActionType>;
}>({ session: initialSession, setSession: () => null });

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useReducer<
    Reducer<SessionType, SessionActionType>
  >(sessionReducer, initialSession);
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export default SessionProvider;
