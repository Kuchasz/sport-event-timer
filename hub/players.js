"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgeCategory = void 0;
const ageCategories = [
    {
        name: "M18-29",
        fitsCategory: ({ Wiek, Płeć }) => Płeć === "M" && Number(Wiek) >= 18 && Number(Wiek) <= 29
    },
    {
        name: "M30-39",
        fitsCategory: ({ Wiek, Płeć }) => Płeć === "M" && Number(Wiek) >= 30 && Number(Wiek) <= 39
    },
    {
        name: "M40-49",
        fitsCategory: ({ Wiek, Płeć }) => Płeć === "M" && Number(Wiek) >= 40 && Number(Wiek) <= 49
    },
    {
        name: "M50-59",
        fitsCategory: ({ Wiek, Płeć }) => Płeć === "M" && Number(Wiek) >= 50 && Number(Wiek) <= 59
    },
    {
        name: "M60-99",
        fitsCategory: ({ Wiek, Płeć }) => Płeć === "M" && Number(Wiek) >= 60 && Number(Wiek) <= 99
    },
    {
        name: "K18-29",
        fitsCategory: ({ Wiek, Płeć }) => Płeć === "K" && Number(Wiek) >= 18 && Number(Wiek) <= 29
    },
    {
        name: "K30-39",
        fitsCategory: ({ Wiek, Płeć }) => Płeć === "K" && Number(Wiek) >= 30 && Number(Wiek) <= 39
    },
    {
        name: "K40-99",
        fitsCategory: ({ Wiek, Płeć }) => Płeć === "K" && Number(Wiek) >= 40 && Number(Wiek) <= 99
    }
];
const getAgeCategory = (p) => ageCategories.find(c => c.fitsCategory(p)).name;
exports.getAgeCategory = getAgeCategory;
