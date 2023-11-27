"use client";

import { Demodal } from "demodal";

type Props = { children: React.ReactNode };

export const DemodalProvider = ({ children }: Props) => {
    return (
        <>
            <Demodal.Container />
            {children}
        </>
    );
};
