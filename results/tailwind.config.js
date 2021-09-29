const colors = require("tailwindcss/colors");

module.exports = {
    purge: ["./components/**/*.tsx", "./pages/**/*.tsx"],
    theme: {
        colors: {
            // Build your palette here
            transparent: "transparent",
            current: "currentColor",
            gray: colors.gray,
            red: colors.red,
            blue: colors.sky,
            yellow: colors.amber,
            orange: colors.orange,
            black: colors.black,
            white: colors.white
        },
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px"
        },
        extend: {
            gridTemplateColumns: {
                "results-grid-cols-1": "minmax(0, 1fr)",
                "results-grid-cols-2": "auto repeat(1, minmax(0, 1fr))",
                "results-grid-cols-3": "auto repeat(2, minmax(0, 1fr))",
                "results-grid-cols-4": "auto repeat(3, minmax(0, 1fr))",
                "results-grid-cols-5": "auto repeat(4, minmax(0, 1fr))",
                "results-grid-cols-6": "auto repeat(5, minmax(0, 1fr))",
                "results-grid-cols-7": "auto repeat(6, minmax(0, 1fr))",
                "results-grid-cols-8": "auto repeat(7, minmax(0, 1fr))",
                "results-grid-cols-9": "auto repeat(8, minmax(0, 1fr))"
            }
        }
    }
};
