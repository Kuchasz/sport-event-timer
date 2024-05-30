import { cva } from "cva";

const chipStyles = cva(["rounded-sm", "bg-blue-50", "px-1.5", "py-0.5", "font-mono", "font-semibold", "text-blue-600"], {
    variants: {
        color: {
            blue: "bg-blue-50 text-blue-600",
            orange: "bg-orange-50 text-orange-600",
            red: "bg-red-50 text-red-600",
            gray: "bg-gray-50 text-gray-600",
            green: "bg-green-50 text-green-600",
        },
    },
});

export const PoorChip = ({ label, color }: { label: string; color: "blue" | "orange" | "red" | "gray" | "green" }) => {
    return <span className={chipStyles({ color })}>{label}</span>;
};
