const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");
const timerModulePath = path.join(__dirname, "../timer");

module.exports = {
    style: {
        postcss: {
            plugins: [require("tailwindcss"), require("autoprefixer")]
        }
    },
    webpack: {
        alias: {},
        plugins: [],
        configure: (webpackConfig, { env, paths }) => {
            const { isFound, match } = getLoader(webpackConfig, loaderByName("babel-loader"));
            console.log("fork-ts-checker-webpack-plugin WAS FOUND?", isFound);
            if (isFound) {
                const include = Array.isArray(match.loader.include) ? match.loader.include : [match.loader.include];
                match.loader.include = include.concat[timerModulePath];
            }
            return webpackConfig;
        }
    }
};
