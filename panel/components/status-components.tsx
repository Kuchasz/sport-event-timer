"use client";

import { useCurrentRaceId } from "hooks";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { selectedRaceIdAtom } from "states/panel-states";
import { trpc } from "trpc-core";
import { PoorSelect2 } from "./poor-select";
import { mdiPowerStandby } from "@mdi/js";
import Icon from "@mdi/react";
import { signOut } from "next-auth/react";
import { AppRouterOutputs } from "trpc";
import { useRouter } from "next/navigation";

type Races = AppRouterOutputs["race"]["myRaces"];

export const RaceSelector = ({ races: initialData }: { races: Races }) => {
    const { data: items } = trpc.race.myRaces.useQuery(undefined, { initialData });
    const [selectedRaceId, selectRaceId] = useAtom(selectedRaceIdAtom);
    const raceId = useCurrentRaceId() || selectedRaceId;
    const router = useRouter();    

    // console.log(selectedRaceId);

    useEffect(() => {
        !selectedRaceId && items && items.length && selectRaceId(items[0]?.id);
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
    <div className="flex opacity-50 hover:opacity-100 transition-opacity items-center cursor-pointer text-sm" onClick={() => signOut()}>
        <Icon path={mdiPowerStandby} size={0.5}></Icon>
        <span className="ml-1">Logout</span>
    </div>
);
