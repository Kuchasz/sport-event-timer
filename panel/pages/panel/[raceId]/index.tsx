import { TimerState } from "@set/timer/dist/store";
import { useCurrentRaceId } from "hooks";

type Props = {
    state: TimerState;
};

const Index = ({}: Props) => {
    const raceId = useCurrentRaceId();

    return (
        <>
            <h3>Some dashboard for race: {raceId}</h3>
            <div className="flex w-full relative justify-center overflow-hidden">
                <div className="w-full my-12 max-w-6xl flex flex-col items-start justify-center"></div>
            </div>
        </>
    );
};

export default Index;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";