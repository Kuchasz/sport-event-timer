const colors = require("tailwindcss/colors");

module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    darkMode: false, // or 'media' or 'class'
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
        extend: {}
    },
    variants: {
        extend: {
            opacity: ["disabled"],
            borderWidth: ["disabled"],
            backgroundColor: ["disabled"],
            textColor: ["disabled"]
        }
    },
    plugins: []
};
