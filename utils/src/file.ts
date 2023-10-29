export const triggerBase64Download = (base64Data: string, fileName: string) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = base64Data;
    downloadLink.download = fileName;
    downloadLink.click();
};

const illegalRe = /[\/\?<>\\:\*\|"]/g;
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const windowsTrailingRe = /[\. ]+$/;

const sanitize = (input: string, replacement: string) =>
    input
        .replace(illegalRe, replacement)
        .replace(controlRe, replacement)
        .replace(reservedRe, replacement)
        .replace(windowsReservedRe, replacement)
        .replace(windowsTrailingRe, replacement);

export const sanitizeFileName = (input: string) => {
    const replacement = "";
    const output = sanitize(input, replacement);
    if (replacement === "") {
        return output;
    }
    return sanitize(output, "");
};
