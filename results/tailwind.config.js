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
            orange: colors.red,
            black: colors.black,
            white: colors.white
        },
        extend: {}
    }
};
