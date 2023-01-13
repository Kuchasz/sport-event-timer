import { TimerState } from "@set/timer/dist/store";

type Props = {
    state: TimerState;
};

const Index = ({}: Props) => {
    return (
        <>
            <h3>Some dashboard for [ADMIN]</h3>
            <div className="flex w-full relative justify-center overflow-hidden">
                <div className="w-full my-12 max-w-6xl flex flex-col items-start justify-center"></div>
            </div>
        </>
    );
};

export default Index;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";