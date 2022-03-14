const colors = require("tailwindcss/colors");

module.exports = {
    mode: "jit",
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
            white: colors.white,
            zinc: colors.zinc
        },
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px"
        },
        extend: {
            zIndex: {
                "-1": "-1"
            },
            dropShadow: {
                "3xl": "0 3px 5px black",
                "w-2xl": "0 2px 10px rgba(255, 255, 255, 0.2)"
            },
            gridTemplateColumns: {
                "results-1": "minmax(0, 1fr)",
                "results-2": "auto repeat(1, minmax(auto, 1fr))",
                "results-3": "auto repeat(2, minmax(auto, 1fr))",
                "results-4": "auto repeat(3, minmax(auto, 1fr))",
                "results-5": "auto repeat(4, minmax(auto, 1fr))",
                "results-6": "auto repeat(5, minmax(auto, 1fr))",
                "results-7": "auto repeat(6, minmax(auto, 1fr))",
                "results-8": "auto repeat(7, minmax(auto, 1fr))",
                "results-9": "auto repeat(8, minmax(auto, 1fr))",
                "results-10": "auto repeat(9, minmax(auto, 1fr))",
                "results-11": "auto repeat(10, minmax(auto, 1fr))",
                "results-12": "auto repeat(11, minmax(auto, 1fr))"
            },
            height: {
                128: "32rem"
            },
            fontSize: {
                "2xs": [".65rem", { lineHeight: "0.75rem" }]
            }
        },
        variants: {
            extend: {
                backgroundColor: ["even", "odd"]
            }
        }
    }
};
