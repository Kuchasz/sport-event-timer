import { trpc } from "../trpc";

export default function IndexPage() {
    const { data } = trpc.useQuery(["classification.classifications"]);
    if (!data) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h2 className="text-2xl uppercase font-semibold">Classifications</h2>
            {data.map(d => (
                <div key={d.id}>
                    {d.id}:{d.name}
                </div>
            ))}
        </div>
    );
}
