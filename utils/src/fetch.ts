export const fetchJson = (path: string, body: object) =>
    fetch(path, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(body),
    }).then(r => r.json());
