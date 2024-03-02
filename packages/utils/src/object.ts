export const createNestedObject = (entries: [string, string][]): Record<string, any> => {
    const result: Record<string, any> = {};

    entries.forEach(([path, value]) => {
        const keys: string[] = path.split(".");
        let currentLevel: Record<string, any> = result;

        keys.forEach((key, index) => {
            if (!currentLevel[key]) {
                if (index === keys.length - 1) {
                    // Last key, assign the value
                    currentLevel[key] = value;
                } else {
                    // Create an empty object for the next level
                    currentLevel[key] = {};
                }
            }

            // Move to the next level
            currentLevel = currentLevel[key];
        });
    });

    return result;
};

export const fromDeepEntries = <T>(nestedEntries: [string, T][]) => {
    const nestedObject = {} as any;

    nestedEntries.forEach(([key, value]) => {
        const keys = key.split(".");
        let currentObject = nestedObject;

        keys.forEach((nestedKey, index) => {
            if (index === keys.length - 1) {
                // Last key, set the value
                currentObject[nestedKey] = value;
            } else {
                // Create nested objects if not exist
                currentObject[nestedKey] = currentObject[nestedKey] || {};
                // Move to the next level
                currentObject = currentObject[nestedKey];
            }
        });
    });

    return nestedObject as Record<string, Record<number, Record<number, T>>>;
};

type Path = string;

export const getValueAtPath = <T>(obj: T, path: string): unknown => {
    const keys = path.split(".");

    return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj as any);
};

export const getObjectSlice = (obj: Record<string, any>, paths: Path[]): Record<string, any> => {
    return paths.reduce((acc, path) => {
        const keys = path.split(".");
        let current = obj;

        for (const key of keys) {
            if (current && current.hasOwnProperty(key)) {
                current = current[key];
            } else {
                // Handle the case where the path doesn't exist in the object
                return acc;
            }
        }

        (acc as any)[path] = current;
        return acc;
    }, {});
};

type PropertyList = string[];

export const getAllPropertyNames = (obj: Record<string, any>, parentKey = ""): PropertyList => {
    return Object.entries(obj).reduce((acc: PropertyList, [key, value]) => {
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof value === "object" && value !== null) {
            const nestedProperties = getAllPropertyNames(value, newKey);
            return acc.concat(nestedProperties);
        } else {
            acc.push(newKey);
            return acc;
        }
    }, []);
};
