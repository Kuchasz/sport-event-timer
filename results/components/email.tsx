export const Email = ({ children }: { children: string }) => (
    <a className="hover:text-orange-500 transition-colors" href={`mailto:${children}`}>
        {children}
    </a>
);
