export const Icon = ({ path, size }: { path: string; size: number }) => (
    <svg viewBox="0 0 24 24" role="presentation" style={`"width: ${size}rem; height: ${size}rem;"`}>
        <path d={path} style="fill: currentcolor;"></path>
    </svg>
);
