export const sliceFrom = (start: number) => (string: string) => string.slice(start);

export const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
