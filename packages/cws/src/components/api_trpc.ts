export const getTrpcData = async () => {
    const response = (await fetch(
        "http://localhost:3001/result.results?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22raceId%22%3A15%2C%22classificationId%22%3A31%7D%7D%7D",
    ).then(res => res.json())) as Results[];

    return response[0].result.data.json;
};

export interface Results {
    result: Result;
}

export interface Result {
    data: Data;
}

export interface Data {
    json: JSON[];
    meta: Meta;
}

export interface JSON {
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

export interface Meta {
    values: Record<string, Value[]>;
    referentialEqualities: ReferentialEqualities;
}

export interface ReferentialEqualities {
    "0.ageCategory": string[];
    "0.openCategory": string[];
    "1.ageCategory": string[];
    "2.ageCategory": string[];
    "11.ageCategory": string[];
    "22.openCategory": string[];
    "46.ageCategory": string[];
}

export enum Value {
    Undefined = "undefined",
}
