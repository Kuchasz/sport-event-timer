import { ESLintUtils } from "@typescript-eslint/utils/dist/index.js";

// const createRule = ESLintUtils.RuleCreator.withoutDocs(name => name);

export const rules = {
    "no-empty-toLocaleDateString": ESLintUtils.RuleCreator.withoutDocs({
        // name: "no-empty-toLocaleDateString",
        meta: {
            docs: {
                description: "Function declaration names should start with an upper-case letter.",
            },
            messages: {
                uppercase: "Start this name with an upper-case letter.",
            },
            type: "suggestion",
            schema: [],
        },

        defaultOptions: [],
        create(context) {
            return {
                CallExpression(node) {
                    const { callee } = node;

                    // Check if the method is .toLocaleDateString()
                    if (
                        callee.type === "MemberExpression" &&
                        callee.property.type === "Identifier" &&
                        callee.property.name === "toLocaleDateString"
                    ) {
                        // Check if there are no arguments passed to toLocaleDateString()
                        if (node.arguments.length === 0) {
                            context.report({
                                node: callee.property,
                                messageId: "uppercase",
                                // message: ".toLocaleDateString() without parameters is not allowed.",
                            });
                        }
                    }
                },
            };
        },
    }),
};

export const configs = {
    recommended: {
        rules: {
            "custom-rules/no-empty-toLocaleDateString": "error",
        },
    },
};
