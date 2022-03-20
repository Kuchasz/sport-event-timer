const colors = require("tailwindcss/colors");

module.exports = {
    mode: "jit",
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    theme: {
        colors: {
            // Build your palette here
            transparent: "transparent",
            current: "currentColor",
            gray: colors.neutral,
            red: colors.red,
            blue: colors.sky,
            yellow: colors.amber,
            orange: colors.orange,
            black: colors.black,
            white: colors.white,
            zinc: colors.zinc
        },
        extend: {}
    },
    plugins: []
};
