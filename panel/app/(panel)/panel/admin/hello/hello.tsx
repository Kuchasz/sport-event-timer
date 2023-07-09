"use client"
import { trpc } from "../../../../../trpc-core";

export const Hello = () => {
    const { data } = trpc.classification.classifications.useQuery({ raceId: 0 });
    if (!data) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h2 className="text-2xl font-semibold">Hi!</h2>
        </div>
    );
}