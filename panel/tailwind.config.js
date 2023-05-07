const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    mode: "jit",
    // plugins: [require("@tailwindcss/forms")],
    // safelist: [
    //     {
    //         pattern: /./
    //     }
    // ],
    content: ["./pages/**/*.tsx", "./components/**/*.tsx", "./apps/**/*.tsx"],
    theme: {
        colors: {
            // ...colors,
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
            zinc: colors.zinc,
            amber: colors.amber,
            indigo: colors.indigo,
            pink: colors.purple,
            purple: colors.pink,
            green: colors.green,
            lime: colors.lime,
            slate: colors.slate
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
            },
            keyframes: {
                pushIn: {
                    '0%': { transform: 'scale(1)' },
                    '30%': { transform: 'scale(0.8)' },
                    '100%': { transfrm: 'scale(0.9)' }
                },
                pushInLittle: {
                    '0%': { transform: 'scale(0.95)' },
                    '100%': { transfrm: 'scale(1)' }
                }
            },
            animation: {
                pushIn: 'pushIn 0.2s ease-out',
                pushInLittle: 'pushInLittle 0.2s ease-out'
            }
        }
    }
};
