const hubUrl = process.env.NODE_ENV === "production" ? "https://wss.set-hub.pyszstudio.pl" : "http://localhost:21822";
export const getState = () => fetch(`${hubUrl}/state`).then((x) => x.json());
