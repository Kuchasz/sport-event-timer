import { Classification, RegistrationPlayer } from "@set/timer/model";

const hubUrl = process.env.NODE_ENV === "production" ? "https://wss.set-hub.pyszstudio.pl" : "http://localhost:21822";

export const getAllPlayers = () => f.get("/players/all") as Promise<RegistrationPlayer[]>;
export const getClassifications = () => f.get("/classifications") as Promise<Classification[]>;

export const f = {
    post: <T>(url: string, body: any) =>
        fetch(hubUrl + url, {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(result => result.json() as Promise<T>),
    get: <T>(url: string) => fetch(hubUrl + url).then(resp => resp.json() as Promise<T>)
};
