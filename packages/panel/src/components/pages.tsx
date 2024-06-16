export const SidePage = ({ side, content }: { side: React.ReactNode; content: React.ReactNode }) => {
    return (
        <div className="flex flex-grow overflow-hidden bg-gray-50">
            {side}
            <div className="h-full overflow-x-hidden overflow-y-scroll p-12">{content}</div>
        </div>
    );
};

export const StandardPage = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-grow overflow-x-hidden overflow-y-scroll bg-gray-50">
            <div className="flex-grow p-12">{children}</div>
        </div>
    );
};
