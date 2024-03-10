import { PropsWithChildren } from "react";
import SessionProvider from "./session/sessionContext";

export default function ContextProvider({ children }: PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
