import { Player } from "@set/timer/model";
export type ToStartPlayer = {
    ["Nr zawodnika"]?: string;
    ["Nr chip"]: string;
    ["Klasyfikacja"]: string;
    ["Kategoria"]: string;
    ["Imię"]: string;
    ["Nazwisko"]: string;
    ["Płeć"]: string;
    ["Wiek"]: string;
    ["Data urodzenia"]: string;
    ["Państwo"]: string;
    ["Miasto"]: string;
    ["Nazwa klubu"]: string;
    ["Adres email"]: string;
    ["Telefon"]: string;
    ["Telefon ICE"]: string;
    ["Anonimowy"]: string;
    ["Kwota przelewu"]: string;
    ["Kwota za start"]: string;
    ["Kwota za sklep"]: string;
    ["Kwota za ubezpieczenie"]: string;
    ["Data przelewu"]: string;
    ["Numer transakcji"]: string;
    ["Status opłaty"]: string;
    ["Data rejestracji"]: string;
    ["Nr GPS"]: string;
    ["Status zawodnika"]: string;
    ["Notatka"]: string;
    ["Pliki"]: string;
};

export const emptyToStartPlayer = {
    ["Nr chip"]: undefined,
    ["Płeć"]: undefined,
    ["Wiek"]: undefined,
    ["Data urodzenia"]: undefined,
    ["Państwo"]: undefined,
    ["Miasto"]: undefined,
    ["Adres email"]: undefined,
    ["Telefon"]: undefined,
    ["Telefon ICE"]: undefined,
    ["Anonimowy"]: undefined,
    ["Kwota przelewu"]: undefined,
    ["Kwota za start"]: undefined,
    ["Kwota za sklep"]: undefined,
    ["Kwota za ubezpieczenie"]: undefined,
    ["Data przelewu"]: undefined,
    ["Numer transakcji"]: undefined,
    ["Status opłaty"]: undefined,
    ["Data rejestracji"]: undefined,
    ["Nr GPS"]: undefined,
    ["Status zawodnika"]: undefined,
    ["Notatka"]: undefined,
    ["Pliki"]: undefined
};

const getGender = (genderText: string) => (genderText === "M" ? "male" : "female");

export const toStartPlayerToPlayer = (player: ToStartPlayer, i: number): Player => ({
    id: i,
    name: player["Imię"],
    lastName: player["Nazwisko"],
    gender: getGender(player["Płeć"]),
    birthYear: Number(player["Data urodzenia"].split(".")[2]),
    number: Number(player["Nr zawodnika"]),
    raceCategory: player["Kategoria"],
    team: player["Nazwa klubu"],
    city: player["Miasto"],
    country: player["Państwo"]
});
