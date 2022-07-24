const secondMillis = 1_000;
const minuteMillis = secondMillis * 60;
const hourMillis = minuteMillis * 60;

export const milisecondsToTimeString = (miliseconds: number | undefined | null) => {
    if (miliseconds === null || miliseconds === undefined) return "";
    const hours = Math.floor(miliseconds / hourMillis);
    const minutes = Math.floor((miliseconds - hours * hourMillis) / minuteMillis);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const timeStringToMiliseconds = (timeString: string) => {
    if (!/\d\d:\d\d/gm.test(timeString)) {
        alert("Passed value does not match pattern HH:MM");
        return undefined;
    }

    const [hour, minutes] = timeString.split(":");
    return minuteMillis * Number(minutes) + hourMillis * Number(hour);
};
