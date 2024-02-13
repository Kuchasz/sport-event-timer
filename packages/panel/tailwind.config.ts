import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

module.exports = {
    mode: "jit",
    plugins: [require("tailwindcss-animate")],
    // safelist: [
    //     {
    //         pattern: /./
    //     }
    // ],
    content: ["./pages/**/*.tsx", "./components/**/*.tsx", "./apps/**/*.tsx", "./app/**/*.tsx"],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
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
            slate: colors.slate,
            sky: colors.sky,
        },
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1400px",
            tall: [{ raw: "(aspect-ratio: 1/1)" }, { raw: "(max-aspect-ratio: 1/1)" }],
            wide: { raw: "(min-aspect-ratio: 1/1)" },
        },
        extend: {
            animation: {
                pushIn: "pushIn 0.3s ease-out",
                pushInLittle: "pushInLittle 0.2s ease-out",
                fadeIn: "fadeIn 0.2s",
                fadeOut: "fadeOut 0.2s",
                wave: "wave 1s infinite",
            },
            borderRadius: {
                lg: `var(--radius)`,
                md: `calc(var(--radius) - 2px)`,
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            dropShadow: {
                "3xl": "0 3px 5px black",
                "w-2xl": "0 2px 10px rgba(255, 255, 255, 0.2)",
            },
            fontFamily: {
                sans: ['"Inter var"', ...defaultTheme.fontFamily.sans],
                mono: ['"Fira code"', ...defaultTheme.fontFamily.mono],
            },
            fontSize: {
                "2xs": [".65rem", { lineHeight: "0.75rem" }],
            },
            height: {
                128: "32rem",
            },
            keyframes: {
                pushIn: {
                    "0%": { transform: "scale(1)" },
                    "25%": { transform: "scale(0.7)" },
                    "100%": { transfrm: "scale(1)" },
                },
                pushInLittle: {
                    "0%": { transform: "scale(0.9)" },
                    "100%": { transfrm: "scale(1)" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "100" },
                },
                fadeOut: { "0%": { opacity: "100" }, "100%": { opacity: "0" } },
                wave: {
                    "10%": {
                        boxShadow: "0 0 0 0px rgba(249, 115, 22, 0.2)",
                    },
                    "100%": {
                        boxShadow: "0 0 0 20px rgba(249, 115, 22, 0)",
                    },
                },
            },
            zIndex: {
                "-1": "-1",
            },
        },
    },
} satisfies Config;
