import { areOverlapping } from "@set/utils/dist/array";
import { Gender } from "./model";

// const ageCategories = [
//     {
//         name: "M18-29",
//         fitsCategory: ({ Wiek, Płeć }: ToStartPlayer) => Płeć === "M" && Number(Wiek) >= 18 && Number(Wiek) <= 29
//     },
//     {
//         name: "M30-39",
//         fitsCategory: ({ Wiek, Płeć }: ToStartPlayer) => Płeć === "M" && Number(Wiek) >= 30 && Number(Wiek) <= 39
//     },
//     {
//         name: "M40-49",
//         fitsCategory: ({ Wiek, Płeć }: ToStartPlayer) => Płeć === "M" && Number(Wiek) >= 40 && Number(Wiek) <= 49
//     },
//     {
//         name: "M50-59",
//         fitsCategory: ({ Wiek, Płeć }: ToStartPlayer) => Płeć === "M" && Number(Wiek) >= 50 && Number(Wiek) <= 59
//     },
//     {
//         name: "M60-99",
//         fitsCategory: ({ Wiek, Płeć }: ToStartPlayer) => Płeć === "M" && Number(Wiek) >= 60 && Number(Wiek) <= 99
//     },
//     {
//         name: "K18-29",
//         fitsCategory: ({ Wiek, Płeć }: ToStartPlayer) => Płeć === "K" && Number(Wiek) >= 18 && Number(Wiek) <= 29
//     },
//     {
//         name: "K30-39",
//         fitsCategory: ({ Wiek, Płeć }: ToStartPlayer) => Płeć === "K" && Number(Wiek) >= 30 && Number(Wiek) <= 39
//     },
//     {
//         name: "K40-99",
//         fitsCategory: ({ Wiek, Płeć }: ToStartPlayer) => Płeć === "K" && Number(Wiek) >= 40 && Number(Wiek) <= 99
//     }
// ];

export type AgeCategory = {
    name: string;
    gender: Gender;
    range: { from: number; to: number };
};

export type AgeCategoryMatcher = {
    name: string;
    fitsCategory: (age: number, gender: Gender) => boolean;
};

export const getAgeAtEventDate = (eventDate: Date, birthDate: Date) => eventDate.getFullYear() - birthDate.getFullYear();

type MatchersResult = {
    type: "Success" | "Error";
    errorType?: "RangesOverlap";
    categoryMatchers: AgeCategoryMatcher[];
};

export const getCategoryMatchers = (categories: AgeCategory[]): MatchersResult => {
    const rangesOverlapping = categories.some(c =>
        categories.some(cc => c.name !== cc.name && c.gender === cc.gender && areOverlapping(c.range, cc.range)),
    );

    if (rangesOverlapping)
        return {
            type: "Error",
            categoryMatchers: [],
            errorType: "RangesOverlap",
        };

    return {
        type: "Success",
        categoryMatchers: categories.map(({ name, gender, range }) => ({
            name,
            fitsCategory: (age: number, playerGender: Gender) => gender === playerGender && age >= range.from && age <= range.to,
        })),
    };
};

export const matchPlayersToCategories = (
    eventDate: Date,
    players: { id: number; birthDate: Date; gender: Gender }[],
    matchers: AgeCategoryMatcher[],
) => {
    const playersWithAges = players.map(p => ({
        player: p,
        age: getAgeAtEventDate(eventDate, p.birthDate),
    }));

    return playersWithAges.map(p => [p.player.id, matchers.find(m => m.fitsCategory(p.age, p.player.gender))?.name]);
};
