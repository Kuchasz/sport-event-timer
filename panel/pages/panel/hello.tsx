import { trpc } from "../../connection";

export default function IndexPage() {
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
