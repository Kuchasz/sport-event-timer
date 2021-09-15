import Icon from "@mdi/react";

export const PrimaryActionButton = ({ onClick, icon }: { onClick: () => void; icon: string }) => (
    <button
        onClick={onClick}
        className="bg-gradient-to-r from-orange-500 to-red-500 flex items-center rounded-md px-2 py-1 self-center text-white"
    >
        <Icon path={icon} size={1} color="white" />
    </button>
);

export const ActionButton = ({ onClick, icon, text }: { onClick: () => void; icon?: string; text?: string }) => (
    <button onClick={onClick} className="bg-gray-600 flex items-center rounded-md px-2 py-1 self-center text-white">
        {icon && <Icon path={icon} size={1} color="white" />}
        {text}
    </button>
);
