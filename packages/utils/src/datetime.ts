const secondMillis = 1_000;
const minuteMillis = secondMillis * 60;
const hourMillis = minuteMillis * 60;

export const getCurrentTime = (offset: number, date: Date) => {
    const utcMillis = Date.now() + offset;
    const newDate = new Date(utcMillis);

    newDate.setFullYear(date.getFullYear());
    newDate.setMonth(date.getMonth());
    newDate.setDate(date.getDate());

    return newDate.getTime();
};
export const formatNumber = (n: number, precision = 2) => n.toLocaleString("en-US", { minimumIntegerDigits: precision });

export const formatTime = (time: Date) =>
    `${formatNumber(time.getHours())}:${formatNumber(time.getMinutes())}:${formatNumber(time.getSeconds())}.${formatNumber(
        time.getMilliseconds(),
        3,
    ).slice(0, 1)}`;

export const splitTime = (time: Date, fullMiliseconds = false) => ({
    hours: formatNumber(time.getHours()),
    minutes: formatNumber(time.getMinutes()),
    seconds: formatNumber(time.getSeconds()),
    miliseconds: fullMiliseconds ? formatNumber(time.getMilliseconds(), 3) : formatNumber(time.getMilliseconds(), 3).slice(0, 1),
});

export const zeroSplits = { hours: "00", minutes: "00", seconds: "00", miliseconds: "0" };

export const getCountdownTime = (time: number) => {
    const currentTime = new Date(time);

    return 60_000 - (currentTime.getSeconds() * 1000 + currentTime.getMilliseconds());
};

export const timeOnlyFormatTimeNoSec = (time?: number) => {
    if (!time) return "__:__";

    const dateTime = new Date(time);

    return `${formatNumber(dateTime.getHours())}:${formatNumber(dateTime.getMinutes())}`;
};

export const formatTimeWithSec = (time?: number) => {
    if (!time) return "__:__:__";
    const dateTime = new Date(time);
    return `${formatNumber(dateTime.getHours())}:${formatNumber(dateTime.getMinutes())}:${formatNumber(dateTime.getSeconds())}`;
};

export const formatTimeWithMilliSec = (time?: number) => {
    if (!time) return "__:__:__.___";
    const dateTime = new Date(time);
    return `${formatNumber(dateTime.getHours())}:${formatNumber(dateTime.getMinutes())}:${formatNumber(
        dateTime.getSeconds(),
    )}.${formatNumber(dateTime.getMilliseconds()).padStart(3, "0")}`;
};

export const formatTimeWithMilliSecUTC = (totalMilliseconds?: number) => {
    if (!totalMilliseconds) return "__:__:__.___";

    const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);
    const milliseconds = totalMilliseconds % 1000;

    if (hours > 0)
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds
            .toString()
            .padStart(3, "0")}`;
    if (minutes > 0) return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
    if (seconds >= 0) return `${seconds.toString()}.${milliseconds.toString().padStart(3, "0")}`;
};

export const formatGap = (totalMilliseconds?: number) => {
    if (!totalMilliseconds) return "";

    const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);
    const milliseconds = totalMilliseconds % 1000;

    if (hours > 0)
        return `+${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds
            .toString()
            .padStart(3, "0")}`;
    if (minutes > 0) return `+${minutes.toString()}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
    if (seconds >= 0) return `+${seconds.toString()}.${milliseconds.toString().padStart(3, "0")}`;
};

export const timeSeconds = (timeMs: number) => new Date(timeMs).getSeconds();

export const milisecondsToTimeString = (miliseconds: number | undefined | null) => {
    if (miliseconds === null || miliseconds === undefined) return "";
    const hours = Math.floor(miliseconds / hourMillis);
    const minutes = Math.floor((miliseconds - hours * hourMillis) / minuteMillis);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const daysFromNow = (days: number) => new Date(new Date().getTime() + days * 86_400_000);

export const calculateAge = (birthDate: Date): number => new Date().getFullYear() - birthDate.getFullYear();

export const dateFromYearsAgo = (years: number) => {
    const currentDate = new Date();
    const newDate = new Date(currentDate.getFullYear() - years, currentDate.getMonth(), currentDate.getDate());
    return newDate;
};

const todayDateObject = new Date();
todayDateObject.setHours(0, 0, 0, 0);

export const isTodayOrLater = (date: Date) => {
    const dateCopyDateObject = new Date(date);
    dateCopyDateObject.setHours(0, 0, 0, 0);

    return dateCopyDateObject >= todayDateObject;
};

export const isPast = (date: Date) => {
    const dateCopyDateObject = new Date(date);
    dateCopyDateObject.setHours(0, 0, 0, 0);

    return dateCopyDateObject < todayDateObject;
};

//potential timezone related i__ues
export const getCurrentYear = () => new Date().getFullYear();

type MonthFormat = "long" | "numeric" | "2-digit" | "short" | "narrow" | undefined;
type WeekdayFormat = "long" | "short" | "narrow" | undefined;

export const monthForLocale = (month: number, monthFormat: MonthFormat = "long", localeName = "es-MX") =>
    new Intl.DateTimeFormat(localeName, { month: monthFormat }).format(new Date(Date.UTC(2021, month)));

export const dayForLocale = (date: Date, weekdayFormat: WeekdayFormat = "short", localeName = "es-MX") =>
    new Intl.DateTimeFormat(localeName, { weekday: weekdayFormat }).format(
        new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())),
    );

export const stripTime = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const subtractDaysFromDate = (originalDate: Date, daysToSubtract: number) => {
    const newDate = new Date(originalDate);
    newDate.setDate(originalDate.getDate() - daysToSubtract);
    return newDate;
};

export const getEpochDate = (hours: number, minutes: number, seconds: number) => {
    const epochMilliseconds = hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000;
    return new Date(epochMilliseconds);
};

export const addMinutesToDate = (date: Date, minutesToAdd: number) => {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutesToAdd);
    return newDate;
};
