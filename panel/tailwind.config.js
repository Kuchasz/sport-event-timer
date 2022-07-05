const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    mode: "jit",
    content: ["./components/**/*.tsx", "./pages/**/*.tsx"],
    plugins: [require("daisyui")],
    safelist: [
        {
            pattern: /./
        }
    ],
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
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
            tall: [{ raw: "(aspect-ratio: 1/1)" }, { raw: "(max-aspect-ratio: 1/1)" }],
            wide: { raw: "(min-aspect-ratio: 1/1)" }
        },
        extend: {
            zIndex: {
                "-1": "-1"
            },
            dropShadow: {
                "3xl": "0 3px 5px black",
                "w-2xl": "0 2px 10px rgba(255, 255, 255, 0.2)"
            },
            height: {
                128: "32rem"
            },
            fontSize: {
                "2xs": [".65rem", { lineHeight: "0.75rem" }],
                "full-w": ["100vw"],
                "full-h": ["100vh"]
            },
            fontFamily: {
                sans: ["Inter var", ...defaultTheme.fontFamily.sans]
            }
        },
        variants: {
            extend: {
                backgroundColor: ["even", "odd"]
            }
        }
    }
};
