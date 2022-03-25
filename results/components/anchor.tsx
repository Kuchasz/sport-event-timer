type AnchorProps = {
    children: React.ReactNode;
    href: string;
};

export const Anchor = ({ children, href }: AnchorProps) => (
    <a href={href} className="border py-2 px-4 flex border-gray-200 hover:bg-orange-500 hover:text-white">
        {children}
    </a>
);
