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
        extend: {}
    }
};
