//@ts-check
/** @type {import('eslint').Rule.RuleModule['create']} */
module.exports = function (context) {
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
                        message: ".toLocaleDateString() without parameters is not allowed.",
                    });
                }
            }
        },
    };
};
