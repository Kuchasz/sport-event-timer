export const PageWithSide = ({ side, content }: { side: React.ReactNode; content: React.ReactNode }) => {
    return (
        <div className="flex h-full w-full will-change-transform">
            {side}
            <main className="flex h-full grow flex-col overflow-y-auto">{content}</main>
        </div>
    );
};
