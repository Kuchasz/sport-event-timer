/* eslint-disable @typescript-eslint/no-unsafe-call */
declare const fetch: any;

export const getDotnetData = async () => {
    const response = (await fetch("http://localhost:5002/rura/results").then((res: { json: () => any }) => res.json())) as Results[];

    return response;
};

export interface Results {
    id: number;
    bibNumber: string;
    name: string;
    lastName: string;
    classificationId: number;
    team: null | string;
    gender: Gender;
    age: number;
    yearOfBirth: number;
    times: Record<string, Record<string, number>>;
    absences: Record<string, boolean>;
    disqualification: null;
    timePenalties: any[];
    totalTimePenalty: number;
    start: number | null;
    finish: number | null;
    result: number;
    invalidState: InvalidState | null;
    ageCategory: Category | null;
    openCategory: Category | null;
    ageCategoryPlace: number | null;
    openCategoryPlace: number | null;
    gap: number;
}

export interface Category {
    id: number;
    name: Name;
    minAge: number | null;
    maxAge: number | null;
    gender: Gender;
    isSpecial: boolean;
    classificationId: number;
}

export enum Gender {
    Female = "female",
    Male = "male",
}

export enum Name {
    K = "K",
    M = "M",
    M2 = "M2",
    M3 = "M3",
    M4 = "M4",
    M5 = "M5",
    M6 = "M6",
}

export enum InvalidState {
    DNS = "dns",
    Dnf = "dnf",
}
