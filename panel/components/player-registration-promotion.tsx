import { Button } from "./button";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { Label } from "./label";
// import { PoorDatepicker } from "./poor-datepicker";
// import { PoorInput } from "./poor-input";
import { PoorSelect } from "./poor-select";
import { PoorTimepicker } from "./poor-timepicker";
import { useFormState } from "hooks";
import { trpc } from "trpc-core";
import { PoorInput } from "./poor-input";

type PlayerPromotion = AppRouterInputs["player"]["promoteRegistration"]["player"];

type PlayerPromotionFormProps = {
    onReject: () => void;
    onResolve: (player: PlayerPromotion) => void;
    initialPlayerPromotion: PlayerPromotion;
    classifications: AppRouterOutputs["classification"]["classifications"];
};

const PlayerRegistrationPromotionForm = ({ onReject, onResolve, initialPlayerPromotion, classifications }: PlayerPromotionFormProps) => {
    const [player, changeHandler] = useFormState(initialPlayerPromotion, [classifications]);

    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="grow basis-full">
                    <Label>Classification</Label>
                    {classifications && classifications.length ? (
                        <PoorSelect
                            initialValue={player.classificationId}
                            items={classifications}
                            nameKey="name"
                            valueKey="id"
                            onChange={changeHandler("classificationId")}
                        ></PoorSelect>
                    ) : null}
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Bib Number</Label>
                    <PoorInput value={player.bibNumber} onChange={changeHandler("bibNumber")} />
                </div>
            </div>
            {/* <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Name</Label>
                    <PoorInput value={player.name} onChange={changeHandler("name")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Last Name</Label>
                    <PoorInput value={player.lastName} onChange={changeHandler("lastName")} />
                </div>
            </div> */}
            {/* <div className="p-2"></div>
            <div className="flex">
                <div className="grow basis-full">
                    <Label>Gender</Label>
                    <PoorSelect
                        initialValue={player.gender}
                        items={genders}
                        nameKey="name"
                        valueKey="value"
                        onChange={changeHandler("gender")}
                    />
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Birth Date</Label>
                    <PoorDatepicker value={player.birthDate} onChange={changeHandler("birthDate")} />
                </div>
            </div> */}
            {/* <div className="p-2"></div>
            <div>
                <div>
                    <Label>Team</Label>
                    <PoorInput value={player.team} onChange={changeHandler("team")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Country</Label>
                    <PoorInput value={player.country} onChange={changeHandler("country")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>City</Label>
                    <PoorInput value={player.city} onChange={changeHandler("city")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Email</Label>
                    <PoorInput value={player.email} onChange={changeHandler("email")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Phone Number</Label>
                    <PoorInput value={player.phoneNumber} onChange={changeHandler("phoneNumber")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Ice Phone Number</Label>
                    <PoorInput value={player.icePhoneNumber} onChange={changeHandler("icePhoneNumber")} />
                </div>
            </div>
            <div className="p-2"></div> */}
            <div className="flex">
                <div className="grow">
                    <Label>Start Time</Label>
                    <PoorTimepicker value={player.startTime} onChange={changeHandler("startTime")} />
                </div>
            </div>
            <div className="mt-4 flex justify-between">
                <Button onClick={onReject} outline>
                    Cancel
                </Button>
                <Button onClick={() => onResolve({ ...player })}>Save</Button>
            </div>
        </div>
    );
};

type PlayerPromotionProps = {
    onReject: () => void;
    onResolve: (player: PlayerPromotion) => void;
    raceId: number;
};

export const PlayerRegistrationPromotion = ({ raceId, onReject, onResolve }: PlayerPromotionProps) => {
    const { data: classifications } = trpc.classification.classifications.useQuery({ raceId });
    const { data: initialBibNumber } = trpc.player.lastAvailableBibNumber.useQuery({ raceId });
    const { data: initialStartTime } = trpc.player.lastAvailableStartTime.useQuery({ raceId });
    if (!classifications) return;

    const initialPlayerPromotion: PlayerPromotion = {
        classificationId: classifications[0]!.id,
        bibNumber: initialBibNumber,
        startTime: initialStartTime,
    };

    return (
        <PlayerRegistrationPromotionForm
            onReject={onReject}
            onResolve={onResolve}
            classifications={classifications}
            initialPlayerPromotion={initialPlayerPromotion}
        />
    );
};
