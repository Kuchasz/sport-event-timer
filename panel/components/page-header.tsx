export const PageHeader = ({ title, description }: { title: string; description: string }) => (
    <div className="mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <h3 className="py-3 text-sm text-zinc-500">{description}</h3>
    </div>
);
