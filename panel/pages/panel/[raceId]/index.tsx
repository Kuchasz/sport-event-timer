import { TimerState } from "@set/timer/dist/store";
import { trpc } from "connection";
import { useCurrentRaceId } from "hooks";

type Props = {
    state: TimerState;
};

const Index = ({}: Props) => {
    const raceId = useCurrentRaceId();
    const { data: race } = trpc.race.race.useQuery({ raceId: raceId! }, { enabled: !!raceId });

    return (
        <>
            {race && (
                <div>
                    <div>
                        <h1 className="text-3xl">{race.name}</h1>
                        <h2>{race.date.toLocaleDateString()}</h2>
                        <div className="mt-8">
                            <div>
                                <label className="font-semibold text-xs">Players Limit</label>
                                <div>{race.playersLimit}</div>
                            </div>
                            <div>
                                <label className="font-semibold text-xs">Registration Status</label>
                                <div>{race.registrationEnabled ? "enabled" : "disbled"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* <div className="flex w-full relative justify-center overflow-hidden">
                <div className="w-full my-12 max-w-6xl flex flex-col items-start justify-center"></div>
            </div> */}
        </>
    );
};

export default Index;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";
