export const PageHeader = ({ title, description }: { title: string; description: string }) => (
    <div className="mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <h3 className="py-3 text-sm text-zinc-500">{description}</h3>
    </div>
);

export const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
    <div className="mb-4">
        <SectionHeaderTitle title={title} />
        {description && <h3 className="py-1 text-sm text-zinc-500">{description}</h3>}
    </div>
);

export const SectionHeaderTitle = ({ title }: { title: string }) => <h2 className="text-lg font-bold">{title}</h2>;
