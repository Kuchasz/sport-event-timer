// const customPlugin = require("./custom-rules/custom-es-lint-rules.cjs");

/** @type {import("eslint").Linter.Config} */
const config = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["isaacscript", "import"],
    extends: [
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
        "plugin:prettier/recommended",
    ],
    parserOptions: {
        //   ecmaVersion: "latest",
        //   sourceType: "module",
        tsconfigRootDir: __dirname,
        project: [
            "./tsconfig.json",
            "./packages/cws/tsconfig.json",
            "./packages/panel/tsconfig.json",
            "./packages/utils/tsconfig.json",
            "./packages/timer/tsconfig.json",
        ],
    },
    // overrides: [
    //   // Template files don't have reliable type information
    //   {
    //     files: ["./cli/template/**/*.{ts,tsx}"],
    //     extends: ["plugin:@typescript-eslint/disable-type-checked"],
    //   },
    // ],

    rules: {
        // These off/not-configured-the-way-we-want lint rules we like & opt into
        //   "@typescript-eslint/no-explicit-any": "error",
        //   "@typescript-eslint/no-unused-vars": [
        //     "error",
        //     { argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" },
        //   ],
        "no-empty-to-locale-date-string": "error",

        "@typescript-eslint/consistent-type-imports": [
            "error",
            { prefer: "type-imports", fixStyle: "separate-type-imports", disallowTypeAnnotations: false },
        ],
        //   "import/consistent-type-specifier-style": ["error", "prefer-inline"],

        // For educational purposes we format our comments/jsdoc nicely
        //   "isaacscript/complete-sentences-jsdoc": "warn",
        //   "isaacscript/format-jsdoc-comments": "warn",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
                checksVoidReturn: {
                    arguments: false,
                    attributes: false,
                },
            },
        ],

        // These lint rules don't make sense for us but are enabled in the preset configs
        "@typescript-eslint/no-confusing-void-expression": "off",
        "@typescript-eslint/restrict-template-expressions": "off",

        // This rule doesn't seem to be working properly
        "@typescript-eslint/prefer-nullish-coalescing": "off",
    },
};

module.exports = config;
