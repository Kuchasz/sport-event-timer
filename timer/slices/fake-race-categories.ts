import { RaceCategory } from "../model";

export const fakeRaceCategories = [
    {
        id: 0,
        name: "M0",
        maxAge: 20,
        gender: "male"
    },
    {
        id: 1,
        name: "M1",
        maxAge: 30,
        minAge: 21,
        gender: "male"
    },
    {
        id: 2,
        name: "M2",
        maxAge: 40,
        minAge: 31,
        gender: "male"
    },
    {
        id: 3,
        name: "M3",
        minAge: 41,
        gender: "male"
    },
    {
        id: 4,
        name: "K0",
        maxAge: 20,
        gender: "female"
    },
    {
        id: 5,
        name: "K1",
        minAge: 21,
        maxAge: 30,
        gender: "female"
    },
    {
        id: 6,
        name: "K2",
        minAge: 31,
        gender: "female"
    }
] as RaceCategory[];
