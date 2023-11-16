"use client";

import { mdiPowerStandby } from "@mdi/js";
import Icon from "@mdi/react";
import { useCurrentRaceId } from "hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AppRouterOutputs } from "trpc";
import { trpc } from "trpc-core";
import { PoorSelect2 } from "./poor-select";

type Races = AppRouterOutputs["race"]["myRaces"];

export const RaceSelector = ({ races: initialData }: { races: Races }) => {
    const { data: items } = trpc.race.myRaces.useQuery(undefined, { initialData });
    const [selectedRaceId, selectRaceId] = useState<number>(0);
    const raceId = useCurrentRaceId() || selectedRaceId;
    const router = useRouter();

    // console.log(selectedRaceId);

    useEffect(() => {
        !selectedRaceId && items?.length && selectRaceId(items[0]?.id);
    }, [items]);

    return (
        <PoorSelect2
            placeholder="Select race"
            initialValue={raceId}
            onChange={e => {
                if (!e.target.value) return;
                selectRaceId(e.target.value);
                router.push(`/${e.target.value}`);
            }}
            valueKey="id"
            nameKey="name"
            items={items}
        />
    );
};

export const LogoutButton = () => (
    <div
        className="flex cursor-pointer items-center text-sm opacity-50 transition-opacity hover:opacity-100"
        onClick={() => {
            // signOut();
        }}
    >
        <Icon path={mdiPowerStandby} size={0.5}></Icon>
        <span className="ml-1">Logout</span>
    </div>
);
