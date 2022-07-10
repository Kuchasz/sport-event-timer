import { trpc } from "../trpc";

export default function IndexPage() {
    const { data } = trpc.useQuery(["classification.classifications"]);
    if (!data) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h2 className="text-2xl uppercase font-semibold">Results</h2>
        </div>
    );
}
