type CheckInPlayerProps = {
    playerNumber: string;
    playerExists: boolean;
};
export const CheckInPlayer = ({ playerNumber, playerExists }: CheckInPlayerProps) => (
    <span className="bg-orange-500 flex justify-center rounded-md m-8 text-2xl h-16 font-bold py-4 px-12">
        {playerNumber}
        {playerExists && <strong>'Yaaaah!'</strong>}
    </span>
);
