import { useEffect, useState } from "react";

export const useFormState = <T,>(initialFormState: T, depts: unknown[]) => {
    const [state, setState] = useState({ ...initialFormState });

    const fieldChangeHandler =
        <K extends keyof T>(prop: K) =>
        (e: { target: { value: T[K] } }) =>
            setState(prev => ({ ...prev, [prop]: e?.target?.value }));

    const reset = () => setState({ ...initialFormState });
    useEffect(reset, depts);

    return [state, fieldChangeHandler, reset] as const;
};