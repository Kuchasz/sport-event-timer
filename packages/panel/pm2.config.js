module.exports = {
    apps: [
        {
            name: "api",
            script: "src/server/runWsProdServer.ts",
            instances: "max",
            interpreter: "node",
            interpreterArgs: "--import tsx",
        },
        {
            name: "app",
            script: "node_modules/next/dist/bin/next",
            args: "start",
        },
    ],
};
