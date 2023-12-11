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

type Path = string;

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
