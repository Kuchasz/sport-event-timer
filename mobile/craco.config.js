// const path = require("path");
// const { getLoader, loaderByName } = require("@craco/craco");
// const timerModulePath = path.join(__dirname, "../timer");

// module.exports = {
//     style: {
//         postcss: {
//             plugins: [require("tailwindcss"), require("autoprefixer")]
//         }
//     },
//     webpack: {
//         alias: {},
//         plugins: [],
//         configure: (webpackConfig, { env, paths }) => {
//             const { isFound, match } = getLoader(webpackConfig, loaderByName("babel-loader"));
//             if (isFound) {
//                 const include = Array.isArray(match.loader.include) ? match.loader.include : [match.loader.include];
//                 match.loader.include = include.concat[timerModulePath];
//             }

//             webpackConfig.module.rules.concat({
//                 test: /\.js$/,
//                 loader: "webpack-remove-debug" // remove "debug" package
//             });

//             const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
//                 ({ constructor }) => constructor && constructor.name === "ModuleScopePlugin"
//             );

//             webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
//             return webpackConfig;
//         }
//     }
// };
