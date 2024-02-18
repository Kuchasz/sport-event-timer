"use client";

import { createContext } from "react";

export const RegistrationStateContext = createContext<boolean>(false);

export default function RegistrationStateProvider({ value, children }: { value: boolean; children: React.ReactNode }) {
    return <RegistrationStateContext.Provider value={value}>{children}</RegistrationStateContext.Provider>;
}
