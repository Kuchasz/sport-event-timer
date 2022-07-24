import { parse } from "csv-parse";
import { promisify } from "util";
import { readFile, writeFile } from "fs";
import { resolve } from "path";
import { stringify } from "csv-stringify";

export const readFileAsync = promisify(readFile);
export const writeFileAsync = promisify(writeFile);

export const parseCsvAsync = (data: Buffer | string, options: any) =>
    new Promise<any>((res, _) =>
        parse(data, options, (_, results) => {
            res(results);
        })
    );

export const stringifyCsvAsync = (data: any) =>
    new Promise<string>((res, _) => {
        stringify(data, { header: true }, (_, str) => {
            res(str);
        });
    });

export const writeCsvAsync = async <T>(content: T, path: string) => {
    const contentCsvString = await stringifyCsvAsync(content);
    await writeFileAsync(path, contentCsvString);
};

export const writeJsonAsync = async <T>(content: T, path: string) => {
    const json = JSON.stringify(content);
    await writeFileAsync(resolve(path), json);
};

export const readJsonAsync = async <T>(path: string) => {
    const contents = await readFileAsync(resolve(path));
    return JSON.parse(contents.toString()) as T;
};

export const readCsvAsync = async <T>(path: string) => {
    const data = await readFileAsync(resolve(path));
    return (await parseCsvAsync(data, { columns: true })) as T;
};

export const writeJson = <T>(content: T, path: string) => {
    writeFile(resolve(path), JSON.stringify(content), err => {
        if (err) {
            console.log(err);
        } else {
        }
    });
};
