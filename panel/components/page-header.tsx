export const PageHeader = ({ title, description }: { title: string; description: string }) => (
    <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <h3 className="text-xs">{description}</h3>
    </div>
);
