"use client";

import type { UserSession } from "../auth";
import { createContext, useContext } from "react";

type Props = {
    session: UserSession;
    children?: React.ReactNode;
};

const SessionContext = createContext<UserSession>({ sessionId: "", name: "", email: "" });

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ session, children }: Props) => (
    <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
);
