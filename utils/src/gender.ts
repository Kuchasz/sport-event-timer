export type Gender = "male" | "female";

export const genders = [
    { name: "Male", value: "male" as Gender },
    { name: "Female", value: "female" as Gender },
];

export const getGenders = ({ male, female }: { male: string, female: string }) => [
    { name: male, value: "male" as Gender },
    { name: female, value: "female" as Gender },
];
